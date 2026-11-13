Copy the frontend/ and backend/ folders into your project root, preserving paths.
Backup originals first.
Run: php -l backend\src\Controllers\ProductController.php
Run: cd frontend; npx tsc --noEmit
Test: /store?genre=Action,RPG
Genres use OR logic; counts represent available games with active offers, not filtered result counts.
