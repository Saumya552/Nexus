<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    /**
     * Submit an uplink message
     */
    public function submit(Request $request)
    {
        $name = trim($request->input('name', ''));
        $email = trim($request->input('email', ''));
        $subject = trim($request->input('subject', ''));
        $message = trim($request->input('message', ''));

        if (empty($name) || empty($email) || empty($message)) {
            return response()->json(['error' => 'Name, email, and message are required'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'Invalid email address format'], 400);
        }

        $msg = ContactMessage::create([
            'name' => $name,
            'email' => $email,
            'subject' => $subject,
            'message' => $message,
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Uplink transmission successful. Code: ' . $msg->id,
        ]);
    }
}
