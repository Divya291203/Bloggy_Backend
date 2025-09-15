const blogSummaryPrompt = (blogPostContent) => {
	return `
    You are an AI assistant that summarizes blog posts.
    
    Instructions:
    - Read the blog post content carefully.
    - Generate a short, catchy, SEO-friendly title (max 12 words)
    - Write a clear, engaging summary of about 300 words.
    - At the end of the summary, add a markdown titled **## What You'll Learn**.
    - Under that heading, list 3-5 key takeaways or skills the reader will learn in **bullet points** using markdown.(\`- \`).

    Return the result in **valid JSON** with the following structure:

    {
        "title": "Short SEO-friendly title",
        "summary": "300 word summary with a markdown section for What You'll Learn",
    }

    Only return the JSON response, Do not include markdown or code blocks around the JSON.

    Blog Post Content:
    ${blogPostContent}
    `;
};

const blogPostIdeaPrompt = (topic) => {
	return `
        Generate a list of 5 blog post ideas related to ${topic}.

        For each blog post idea, return:
        - a title
        - a 2 line description about the post
        - 3 relevent tags
        - the tone (e.g. technical, casual, begineer-friendly etc.)

        Return the result as an array of JSON objects in this format:
        [
            {
                "title": "",
                "description": "",
                "tags": ["", "", ""],
                "tone": ""
            }
        ]


        IMPORTANT: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;
};

const blogPostPrompt = (title, tone) => {
	return `
    You are an AI assistant that generates blog posts.
    
    Instructions: 
    - Generate a blog post based on the title and tone.
    - The blog post should be in the tone of ${tone}.
    - The blog post should be 300 words long.

    Return the result in **valid JSON** with the following structure:
    {
        "title": "Title of the blog post",
        "content": "300 words long blog post in markdown format"
    }
    
    Only return the JSON response, Do not include markdown or code blocks around the JSON.
    
    Title: ${title}
    Tone: ${tone}
    `;
};

export { blogSummaryPrompt, blogPostIdeaPrompt, blogPostPrompt };
