import { StreamingTextResponse } from 'ai';
import { googleAI, AI_MODEL_CONFIG } from '../../config/ai';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid request body');
    }

    const { messages } = body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format: messages must be a non-empty array');
    }

    // Validate message format
    const isValidMessage = (msg: any) => (
      msg && 
      typeof msg === 'object' && 
      ['user', 'assistant'].includes(msg.role) && 
      typeof msg.content === 'string'
    );

    if (!messages.every(isValidMessage)) {
      throw new Error('Invalid message format: each message must have valid role and content');
    }

    // Create a chat with Google AI
    const model = googleAI.getGenerativeModel({ model: AI_MODEL_CONFIG.model });

    // Format chat history for Google AI
    const formattedHistory = messages.slice(0, -1).map((message: any) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content.trim() }]
    }));

    // Get and validate the latest message
    const latestMessage = messages[messages.length - 1].content.trim();
    if (!latestMessage) {
      throw new Error('Latest message cannot be empty');
    }

    // Generate content with streaming
    const result = await model.generateContentStream({
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: latestMessage }] }
      ],
      generationConfig: {
        temperature: AI_MODEL_CONFIG.temperature,
        maxOutputTokens: AI_MODEL_CONFIG.maxOutputTokens,
        // Removed topK and topP for simplification, aligning closer to Python example
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });

    if (!result) {
      throw new Error('Failed to generate AI response');
    }

    // Convert the response into a friendly text-stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error('Chat API error:', error);
    const statusCode = error.message.includes('Invalid') ? 400 : 500;
    const errorMessage = error.message || 'Failed to process chat request';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { 
        'Content-Type': 'application/json',
        'X-Error-Code': statusCode.toString()
      }
    });
  }
}