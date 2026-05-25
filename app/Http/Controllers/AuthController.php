<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;
use App\Models\UserActivityLog;

class AuthController extends Controller
{
    /**
     * Handle authentication login requests.
     */
    public function login(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        if (empty($username) || empty($password)) {
            return response()->json(['error' => 'Username and passcode required'], 400);
        }

        // 1. Attempt standard User authentication
        $user = User::where('username', $username)->first();
        
        if ($user && Hash::check($password, $user->password)) {
            // Log in using standard Laravel guard
            Auth::login($user);

            // Update user last login
            $user->last_login = now();
            $user->save();

            // Log activity
            $this->logActivity($user->id, $user->username, 'Logged in', $request);

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role' => $user->role,
                    'email' => $user->email,
                ]
            ]);
        }

        // 2. Fallback to Admin authentication
        $admin = Admin::where('username', $username)->first();

        if ($admin && Hash::check($password, $admin->password)) {
            // Update admin last login
            $admin->last_login = now();
            $admin->save();

            // Store admin details in custom session fields since we checked fallback
            session([
                'admin_id' => $admin->id,
                'admin_username' => $admin->username,
                'admin_email' => $admin->email,
                'admin_role' => 'admin',
            ]);

            // Log activity
            $this->logActivity($admin->id, $admin->username, 'Logged in (Admin Override)', $request);

            return response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'role' => 'admin',
                    'email' => $admin->email,
                ]
            ]);
        }

        return response()->json(['error' => 'Invalid username or passcode'], 401);
    }

    /**
     * Terminate user session.
     */
    public function logout(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $this->logActivity($user->id, $user->username, 'Logged out', $request);
            Auth::logout();
        } elseif (session()->has('admin_id')) {
            $this->logActivity(session('admin_id'), session('admin_username'), 'Logged out (Admin)', $request);
            session()->forget(['admin_id', 'admin_username', 'admin_email', 'admin_role']);
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Check if user session is active.
     */
    public function check()
    {
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role' => $user->role,
                    'email' => $user->email,
                ]
            ]);
        } elseif (session()->has('admin_id')) {
            return response()->json([
                'authenticated' => true,
                'user' => [
                    'id' => session('admin_id'),
                    'username' => session('admin_username'),
                    'role' => 'admin',
                    'email' => session('admin_email'),
                ]
            ]);
        }

        return response()->json(['authenticated' => false], 401);
    }

    /**
     * Register a new operator account.
     */
    public function register(Request $request)
    {
        $username = trim($request->input('username', ''));
        $email    = trim($request->input('email', ''));
        $password = $request->input('password', '');

        if (empty($username) || empty($email) || empty($password)) {
            return response()->json(['error' => 'All fields are required'], 400);
        }
        if (strlen($username) < 3) {
            return response()->json(['error' => 'Username must be at least 3 characters'], 400);
        }
        if (strlen($password) < 6) {
            return response()->json(['error' => 'Passcode must be at least 6 characters'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'Invalid email format'], 400);
        }

        // Check if exists
        if (User::where('username', $username)->orWhere('email', $email)->exists()) {
            return response()->json(['error' => 'Username or email already registered'], 409);
        }

        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'user',
            'status' => 'active',
            'avatar_initials' => strtoupper(substr($username, 0, 2)),
        ]);

        $this->logActivity($user->id, $user->username, 'Account created', $request);

        return response()->json(['message' => 'Account created successfully', 'id' => $user->id]);
    }

    /**
     * Audit log helper
     */
    protected function logActivity($userId, $username, $action, Request $request)
    {
        try {
            UserActivityLog::create([
                'user_id' => $userId,
                'username' => $username,
                'action' => $action,
                'ip_address' => $request->ip(),
                'user_agent' => substr($request->header('User-Agent'), 0, 255),
            ]);
        } catch (\Exception $e) {}
    }
}
