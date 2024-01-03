Deno.serve(async (req) => {
  try {
    const { url, prompts } = await req.json();

    const resp = await fetch("https://api.jigsawstack.com/v1/ai/scrape", {
      body: JSON.stringify({
        url,
        element_prompts: prompts,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("JIGSAWSTACK_KEY")!,
      },
      method: "POST",
    });

    const scrapeResp = await resp.json();

    const mappedData = scrapeResp.data.map((d: any) => ({
      selector: d.selector,
      results: d.results.map((r: any) => r.text),
    }));

    return new Response(JSON.stringify(mappedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
