import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { latitude, longitude } = await req.json();

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response(
        JSON.stringify({ error: "Latitude dhe longitude janë të nevojshme" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENWEATHERMAP_API_KEY");
    if (!apiKey) {
      console.error("OPENWEATHERMAP_API_KEY not set");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=sq&appid=${apiKey}`;
    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) {
      const errText = await currentRes.text();
      console.error("OpenWeatherMap current error:", errText);
      return new Response(
        JSON.stringify({ error: "Dështoi marrja e të dhënave të motit" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const currentData = await currentRes.json();

    // 7-day forecast (One Call API 3.0 free tier or 2.5 forecast)
    // Using 2.5 forecast/daily (free) – returns 7 days
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=sq&appid=${apiKey}`;
    const forecastRes = await fetch(forecastUrl);
    let forecastData: any = null;
    if (forecastRes.ok) {
      forecastData = await forecastRes.json();
    }

    // Build response
    const weatherCodeToIcon = (iconCode: string) => {
      const mapping: Record<string, string> = {
        "01d": "☀️", "01n": "🌙",
        "02d": "🌤️", "02n": "🌤️",
        "03d": "⛅", "03n": "⛅",
        "04d": "☁️", "04n": "☁️",
        "09d": "🌧️", "09n": "🌧️",
        "10d": "🌦️", "10n": "🌦️",
        "11d": "⛈️", "11n": "⛈️",
        "13d": "🌨️", "13n": "🌨️",
        "50d": "🌫️", "50n": "🌫️",
      };
      return mapping[iconCode] || "🌡️";
    };

    const iconCode = currentData.weather?.[0]?.icon || "01d";

    // Parse forecast – OpenWeatherMap 2.5 forecast gives 3-hour intervals; group by day
    const dailyMap = new Map<string, { temps: number[]; humidity: number[]; desc: string }>();
    if (forecastData?.list) {
      for (const item of forecastData.list) {
        const date = item.dt_txt?.split(" ")[0];
        if (!date) continue;
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { temps: [], humidity: [], desc: item.weather?.[0]?.description || "" });
        }
        const entry = dailyMap.get(date)!;
        entry.temps.push(item.main.temp);
        entry.humidity.push(item.main.humidity);
      }
    }

    const forecast = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([date, data]) => ({
        date,
        tempMax: Math.round(Math.max(...data.temps)),
        tempMin: Math.round(Math.min(...data.temps)),
        humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
        description: data.desc,
      }));

    const result = {
      location: currentData.name || "Lokacioni juaj",
      temperature: Math.round(currentData.main.temp * 10) / 10,
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6 * 10) / 10, // m/s -> km/h
      description: currentData.weather?.[0]?.description || "",
      icon: weatherCodeToIcon(iconCode),
      forecast,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Gabim i brendshëm i serverit" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
