export async function getRelatedResearch(title: string) {
  console.log("trying to get related papers");
  const fields = "url,abstract,authors";
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
    title
  )}&fields=${fields}`;

  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
