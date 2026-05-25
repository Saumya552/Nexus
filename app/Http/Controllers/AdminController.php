<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;

class AdminController extends Controller
{
    /**
     * Get all contact inbox messages
     */
    public function getMessages()
    {
        // Require administrative credentials
        if (!AuthCheck::isAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $messages = ContactMessage::orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    /**
     * Mark specific message as read
     */
    public function markRead(Request $request)
    {
        if (!AuthCheck::isAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $id = $request->input('id');
        $msg = ContactMessage::find($id);

        if (!$msg) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        $msg->is_read = true;
        $msg->save();

        return response()->json(['success' => true, 'message' => 'Uplink transmission acknowledged']);
    }
}

/**
 * Custom session validator helper
 */
class AuthCheck {
    public static function isAdmin() {
        return auth()->check() && auth()->user()->role === 'admin' || session('admin_role') === 'admin';
    }
}
