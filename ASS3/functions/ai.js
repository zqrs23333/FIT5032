exports.generateText = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method !== "POST") {
      return res.status(400).send("Please send a POST request");
    }
  
    if (req.method === "OPTIONS") {
      // 处理预检请求
      res.status(204).send("");
      return;
    }
  
    res.status(200).send({generated_text: "Response from AI"});
  
    try {
      const userPrompt = req.body.prompt;
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAN_bwCFmLZIsrvTmFiEpfh_JYlvFNiVEY", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "AIzaSyAN_bwCFmLZIsrvTmFiEpfh_JYlvFNiVEY",
        },
        body: JSON.stringify({prompt: userPrompt}),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
  
      const data = await response.json();
      res.status(200).send({generated_text: data.generated_text});
    } catch (error) {
      res.status(500).send("Error: " + error.message);
    }
  });