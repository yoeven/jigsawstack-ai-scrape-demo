Deno.serve(async (req) => {
  try {
    const { url, selectors } = await req.json();

    console.log({ url, selectors });

    const resp = await fetch("https://api.jigsawstack.com/v1/ai/scrape", {
      body: JSON.stringify({
        url,
        // elements: selectors.map((s: string) => ({ selector: s })),
        element_prompts: selectors,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": Deno.env.get("JIGSAWSTACK_KEY")!,
      },
      method: "POST",
    });

    const scrapeResp = await resp.json();

    console.log(scrapeResp);

    if (!scrapeResp.data) throw scrapeResp;

    const mappedData = scrapeResp.data.map((d: any) => ({
      selector: d.selector,
      results: d.results.map((r: any) => r.text),
    }));

    return new Response(JSON.stringify(mappedData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
