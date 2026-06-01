import { tavily as Tavily } from "@tavily/core";

const tvly = Tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchInternet = async ({ query }) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString("en-US", { month: "long" });
    const day = now.getDate();

    // Append current year to query so Tavily doesn't surface old results
    const enrichedQuery = `${query} ${year}`;

    const response = await tvly.search(enrichedQuery, {
      maxResults: 5,
      searchDepth: "basic",
      includeAnswer: true,
    });

    const today = `${month} ${day}, ${year}`;

    let output = `[Search performed on: ${today}]\n`;
    output += `[IMPORTANT: Only use results from ${year}. Ignore any results from previous years.]\n\n`;

    if (response.answer) {
      output += `Tavily Summary Answer:\n${response.answer}\n\n---\n\n`;
    }

    output += response.results
      .map((r, i) => {
        const published = r.publishedDate
          ? `Published: ${r.publishedDate}\n`
          : "";
        const content = r.content?.slice(0, 400) ?? "";
        return `Result ${i + 1}:\nTitle: ${r.title}\n${published}Content: ${content}\nSource: ${r.url}`;
      })
      .join("\n\n");

    return output;
  } catch (error) {
    console.error("Error searching the internet:", error);
    return "Failed to fetch internet results.";
  }
};