<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | تم تعطيله هنا لأننا قمنا بضبطه في ملف .htaccess لمنع مشكلة 
    | التكرار (multiple values) التي تظهر في المتصفح.
    |
    */

    'paths' => [], // جعل المسارات فارغة لتعطيل الميدل وير الخاص بلارافيل

    'allowed_methods' => ['*'],

    'allowed_origins' => [], // تم التفريغ لمنع التكرار

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];