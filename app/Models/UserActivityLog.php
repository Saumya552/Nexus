<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivityLog extends Model
{
    protected $table = 'user_activity_log';

    protected $fillable = [
        'user_id',
        'username',
        'action',
        'ip_address',
        'user_agent',
    ];

    /**
     * Get the user associated with this activity log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
