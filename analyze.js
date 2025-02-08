// Function to retrieve products data from chrome.storage.local
const getProductsData = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ products: [] }, (result) => {
        if (chrome.runtime.lastError) {
          reject('Error retrieving data from storage');
        } else {
          resolve(result.products); // Resolve with the list of products
        }
      });
    });
  };
  

  const analyzeProduct = async () => {
    try {
      const products = await getProductsData();
      
      if (products.length === 0) {
        document.getElementById('result').textContent = "No products found in the list!";
        return;
      }
  
  
      // Format the product list for the prompt
      const productList = products.map((product, index) => {
        return `Product ${index + 1}: ${product.productName}, Price: ${product.productPrice}, Features: ${product.productFeatures.join(', ')}`;
      }).join("\n");
  
      const prompt = `
        Here are products I want to buy. Rank them in order of recommendation. 
        Assume my budget is the median of the prices of the products.
        Give me rankings of recommendations. Keep the tone friendly and personal. Avoid reading spec sheet, just say what aspect is better than other. Put in specs when the specs are well known to general public. Remember, this prompt is backend, and the response to this prompt is frontend. 
        The length of answer should depend on the conclusion of the analysis.

        The answer should be in HTML format. Maybe table or bullet points when required. Nothing else, just HTML. Randomly pick between whether to use bullet points or table or pros and cons.
        The products:
        ${productList}
      `;
  
      const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
      const apiKey = "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";  // Replace with your actual Groq API key
  
      const requestBody = {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      };
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch Groq API');
      }
  
      const responseData = await response.json();
      document.getElementById('result').innerHTML = responseData.choices[0]?.message?.content || "No suggestion available.";
      document.getElementById('loadingMessage').style.display = 'none';
      
    } catch (error) {
      document.getElementById('result').textContent = `Error: ${error.message}`;
    }
  };
  
  // Start analysis once the page loads
  window.onload = analyzeProduct;
  