export default async function fetchQuestions() {
    const res = await fetch(process.env.API_ENDPOINT+'/allQuestions', { cache: "no-cache" });
    if (!res.ok) {
      throw new Error('Failed to fetch questions');
    }
    return res.json();
  }
  