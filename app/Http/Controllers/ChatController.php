<?php

namespace App\Http\Controllers;

use App\Ai\Agents\ChatAgent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Ai\Contracts\ConversationStore;

class ChatController extends Controller
{
    public function index(Request $request, ConversationStore $store, ?string $id = null)
    {
        $user = auth()->user();
        $history = [];
        $conversationId = $id;
        $conversations = [];

        if ($user) {
            if (!$conversationId && !$request->has('new')) {
                $conversationId = $store->latestConversationId($user->id);
            }

            $conversations = \App\Models\AgentConversation::where('user_id', $user->id)
                ->latest('updated_at')
                ->get()
                ->map(fn ($c) => [
                    'id' => $c->id,
                    'title' => $c->title,
                    'updated_at' => $c->updated_at->diffForHumans(),
                ])->toArray();

            if ($conversationId) {
                $history = $store->getLatestConversationMessages($conversationId, 50)
                    ->map(fn ($message) => [
                        'role' => $message->role,
                        'content' => $message->content,
                    ])->toArray();
            }
        }

        return Inertia::render('AIChat', [
            'initialMessages' => $history,
            'initialConversationId' => $conversationId,
            'conversations' => $conversations,
        ]);
    }

    public function ask(Request $request)
    {
        $agent = new ChatAgent();

        $user = auth()->user();
        $conversationId = $request->input('conversation_id');

        if ($conversationId) {
            $agent->continue($conversationId, $user);
        } elseif ($user) {
            $agent->forUser($user);
        }

        $response = $agent->ask($request->message);

        return response()->json([
            'reply' => $response->text,
            'conversation_id' => $response->conversationId,
        ]);
    }
}
