<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProviderUpdateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'             => 'sometimes|string|max:255',
            'phone'            => 'nullable|string|max:20',
            'city'             => 'nullable|string|max:100',
            'bio'              => 'nullable|string|max:2000',
            'experience_years' => 'nullable|integer|min:0|max:60',
            'hourly_rate'      => 'nullable|numeric|min:0|max:99999',
            'service_area'     => 'nullable|string|max:255',
            'category_ids'     => 'nullable|array',
            'category_ids.*'   => 'exists:categories,id',
            'profile_photo'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
