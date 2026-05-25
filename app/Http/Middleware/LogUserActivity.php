<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserActivityLog;

class LogUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Perform post-routing auditing for state-changing requests (POST, PUT, DELETE)
        if ($response->isSuccessful() && in_array($request->method(), ['POST', 'PUT', 'DELETE'])) {
            $userId = auth()->check() ? auth()->id() : (session('admin_id') ?: 0);
            $username = auth()->check() ? auth()->user()->username : (session('admin_username') ?: 'Anonymous');
            
            $path = $request->path();
            $action = 'API Access: ' . $request->method() . ' /' . $path;

            // Explicitly customize standard routes for readability
            if ($path === 'api/auth/login') {
                return $response; // Already handled by AuthController manually
            } elseif ($path === 'api/auth/logout') {
                return $response; // Already handled by AuthController manually
            } elseif ($path === 'api/contact/submit') {
                $action = 'Submitted uplink contact form';
            }

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

        return $response;
    }
}
