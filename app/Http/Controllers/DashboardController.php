<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\AgentConversation;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $chatCount = AgentConversation::where('user_id', auth()->id())->count();

        return Inertia::render('dashboard', [
            'chatCount' => $chatCount,
        ]);
    }
}
