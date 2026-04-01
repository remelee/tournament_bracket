exports.handler = async function (event) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured on server." }),
    };
  }

  const q = event.queryStringParameters?.q;
  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query parameter: q" }),
    };
  }

  const ytUrl =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&maxResults=8` +
    `&q=${encodeURIComponent(q)}&key=${apiKey}`;

  try {
    const res = await fetch(ytUrl);
    const data = await res.json();

    if (data.error) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: data.error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to reach YouTube API." }),
    };
  }
};