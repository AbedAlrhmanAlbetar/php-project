<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Provider;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name'        => 'Admin User',
            'email'       => 'admin@handyman.com',
            'password'    => Hash::make('password'),
            'role'        => 'admin',
            'city'        => 'New York',
            'is_verified' => true,
        ]);

        // Categories
        $categories = [
            ['name' => 'Plumbing',       'icon' => '🔧', 'slug' => 'plumbing'],
            ['name' => 'Electrical',     'icon' => '⚡', 'slug' => 'electrical'],
            ['name' => 'Carpentry',      'icon' => '🪚', 'slug' => 'carpentry'],
            ['name' => 'Painting',       'icon' => '🎨', 'slug' => 'painting'],
            ['name' => 'Cleaning',       'icon' => '🧹', 'slug' => 'cleaning'],
            ['name' => 'Tutoring',       'icon' => '📚', 'slug' => 'tutoring'],
            ['name' => 'AC & Heating',   'icon' => '❄️',  'slug' => 'ac-heating'],
            ['name' => 'Landscaping',    'icon' => '🌿', 'slug' => 'landscaping'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $categoryIds = Category::pluck('id')->toArray();

        // Providers
        $cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];

        for ($i = 1; $i <= 12; $i++) {
            $city = $cities[array_rand($cities)];

            $user = User::create([
                'name'        => "Provider $i",
                'email'       => "provider$i@handyman.com",
                'password'    => Hash::make('password'),
                'role'        => 'provider',
                'city'        => $city,
                'is_verified' => true,
            ]);

            $provider = Provider::create([
                'user_id'          => $user->id,
                'bio'              => "Experienced professional with over " . rand(2, 15) . " years in the field.",
                'experience_years' => rand(2, 20),
                'hourly_rate'      => rand(25, 150),
                'service_area'     => $city . " and surrounding areas",
            ]);

            // Assign 1-3 categories
            $assigned = array_rand(array_flip($categoryIds), rand(1, 3));
            $provider->categories()->attach((array) $assigned);
        }

        // Customers
        for ($i = 1; $i <= 5; $i++) {
            User::create([
                'name'        => "Customer $i",
                'email'       => "customer$i@handyman.com",
                'password'    => Hash::make('password'),
                'role'        => 'customer',
                'city'        => $cities[array_rand($cities)],
                'is_verified' => true,
            ]);
        }

        // Add some reviews
        $providers  = Provider::all();
        $customers  = User::where('role', 'customer')->get();

        foreach ($providers->take(6) as $provider) {
            foreach ($customers->take(3) as $customer) {
                Review::create([
                    'reviewer_id' => $customer->id,
                    'provider_id' => $provider->id,
                    'rating'      => rand(3, 5),
                    'comment'     => 'Great service, very professional and punctual!',
                ]);
            }
        }
    }
}
