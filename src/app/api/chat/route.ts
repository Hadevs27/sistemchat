import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { callManager } from '@/lib/manager';
import { callSpecialist } from '@/lib/specialist';
import { getRelevantContext } from '@/lib/retrieval';

export async function POST(req: Request) {
  try {
    const { conversationId, message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentConvId = conversationId;
    if (!currentConvId) {
      const { data: conv, error: convErr } = await supabase.from('conversations').insert({}).select('id').single();
      if (convErr) throw convErr;
      currentConvId = conv?.id;
    }

    // Save user message
    await supabase.from('messages').insert({
      conversation_id: currentConvId,
      role: 'user',
      content: message
    });

    // Fetch bounded history (last 5 messages)
    const { data: historyData } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', currentConvId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    const history = (historyData || []).reverse().slice(0, -1); // Exclude the current message we just inserted

    const managerRes = await callManager(history, message);
    
    let finalAnswer = '';
    let finalAgent = '';
    let finalUsage = managerRes.usage;

    if (managerRes.route === 'DIRECT') {
      finalAnswer = managerRes.answer || 'I am unable to provide a direct answer.';
      finalAgent = 'manager';
    } else {
      const context = await getRelevantContext(message);
      const specRes = await callSpecialist(message, context);
      finalAnswer = specRes.answer;
      finalAgent = 'specialist';
      finalUsage = {
        inputTokens: managerRes.usage.inputTokens + specRes.usage.inputTokens,
        outputTokens: managerRes.usage.outputTokens + specRes.usage.outputTokens,
        totalTokens: managerRes.usage.totalTokens + specRes.usage.totalTokens,
      };
    }

    // Save assistant message
    await supabase.from('messages').insert({
      conversation_id: currentConvId,
      role: 'assistant',
      agent: finalAgent,
      content: finalAnswer,
      input_tokens: finalUsage.inputTokens,
      output_tokens: finalUsage.outputTokens,
      total_tokens: finalUsage.totalTokens
    });

    return NextResponse.json({
      conversationId: currentConvId,
      message: finalAnswer,
      agent: finalAgent,
      usage: finalUsage
    });

  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
