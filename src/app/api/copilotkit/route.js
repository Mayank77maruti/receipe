import {
    CopilotRuntime,
    GoogleGenerativeAIAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';

import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash', 
});

const serviceAdapter = new GoogleGenerativeAIAdapter({ model });

const runtime = new CopilotRuntime();

export const POST = async (req) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter,
        endpoint: '/api/copilotkit', 
    });

    return handleRequest(req);
};
