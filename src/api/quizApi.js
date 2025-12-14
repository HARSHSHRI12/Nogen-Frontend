export const submitQuizResult = async (data) => {
  try {
    const res = await fetch('http://localhost:3500/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error(" Failed to submit result:", err);
  }
};
