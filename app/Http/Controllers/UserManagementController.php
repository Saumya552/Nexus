<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserActivityLog;

class UserManagementController extends Controller
{
    /**
     * Guard validator
     */
    protected function checkAdmin()
    {
        return auth()->check() && auth()->user()->role === 'admin' || session('admin_role') === 'admin';
    }

    /**
     * List all users + summary stats
     */
    public function list()
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $users = User::orderBy('created_at', 'desc')->get();
        
        $total = count($users);
        $active = $users->where('status', 'active')->count();
        $admins = $users->where('role', 'admin')->count();

        return response()->json([
            'users' => $users,
            'stats' => [
                'total' => $total,
                'active' => $active,
                'admins' => $admins,
            ]
        ]);
    }

    /**
     * Create a new operator
     */
    public function create(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $username = trim($request->input('username', ''));
        $email = trim($request->input('email', ''));
        $password = trim($request->input('password', ''));
        $role = $request->input('role', 'user');

        if (empty($username) || empty($email) || empty($password)) {
            return response()->json(['error' => 'All fields are required'], 400);
        }

        if (User::where('username', $username)->orWhere('email', $email)->exists()) {
            return response()->json(['error' => 'Username or email already exists'], 492);
        }

        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role,
            'status' => 'active',
            'avatar_initials' => strtoupper(substr($username, 0, 2)),
        ]);

        $this->logActivity('Created user: ' . $username, $request);

        return response()->json([
            'success' => true,
            'id' => $user->id,
            'message' => 'User ' . $username . ' created successfully',
        ]);
    }

    /**
     * Update an operator
     */
    public function update(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $id = (int)$request->input('id');
        $email = trim($request->input('email', ''));
        $role = $request->input('role', 'user');
        $password = $request->input('password');

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->email = $email;
        $user->role = $role;

        if (!empty($password)) {
            $user->password = Hash::make($password);
        }

        $user->save();

        $this->logActivity('Updated user ID: ' . $id, $request);

        return response()->json(['success' => true, 'message' => 'User updated successfully']);
    }

    /**
     * Delete an operator
     */
    public function delete(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $id = (int)$request->input('id');

        // Prevent self deletion
        $currentId = auth()->check() ? auth()->id() : 0;
        if ($id === $currentId) {
            return response()->json(['error' => 'Cannot delete yourself'], 400);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $username = $user->username;
        $user->delete();

        $this->logActivity('Deleted user: ' . $username, $request);

        return response()->json(['success' => true, 'message' => 'User deleted successfully']);
    }

    /**
     * Toggle operator status
     */
    public function toggle(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $id = (int)$request->input('id');
        $status = $request->input('status', 'active');

        if (!in_array($status, ['active', 'offline', 'suspended'])) {
            return response()->json(['error' => 'Invalid status'], 400);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->status = $status;
        $user->save();

        $this->logActivity('Set user ' . $id . ' status to ' . $status, $request);

        return response()->json(['success' => true]);
    }

    /**
     * Get system activity audit logs
     */
    public function getLogs()
    {
        if (!$this->checkAdmin()) {
            return response()->json(['error' => 'Access Denied'], 403);
        }

        $logs = UserActivityLog::orderBy('created_at', 'desc')->limit(50)->get();
        return response()->json($logs);
    }

    /**
     * Log helper
     */
    protected function logActivity($action, Request $request)
    {
        try {
            $userId = auth()->check() ? auth()->id() : (session('admin_id') ?: 0);
            $username = auth()->check() ? auth()->user()->username : (session('admin_username') ?: 'System');

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
