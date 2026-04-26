<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $slugUnique = 'unique:categories,slug';
        if ($this->route('category')) {
            $slugUnique .= ',' . $this->route('category')->id;
        }

        return [
            'name' => 'required|string|max:100',
            'slug' => ['nullable', 'string', 'max:120', $slugUnique],
            'icon' => 'nullable|string|max:50',
        ];
    }
}
