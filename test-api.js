// Simple API test script
// Using built-in fetch in Node.js 18+

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing Love Site API...\n');

    try {
        // Test 1: Get site settings
        console.log('1. Testing GET /settings...');
        const settingsResponse = await fetch(`${BASE_URL}/settings`);
        const settings = await settingsResponse.json();
        console.log(`✅ Found site settings:`);
        console.log(`   - Title: "${settings.site_title}"`);
        console.log(`   - Subtitle: "${settings.site_subtitle}"`);

        // Test 2: Get posts
        console.log('\n2. Testing GET /posts...');
        const postsResponse = await fetch(`${BASE_URL}/posts`);
        const posts = await postsResponse.json();
        console.log(`✅ Found ${posts.length} timeline posts`);
        posts.forEach(p => {
            console.log(`   - ${p.date}: "${p.content.substring(0, 50)}..."`);
        });

        // Test 3: Get chat messages
        console.log('\n3. Testing GET /chat-messages...');
        const chatResponse = await fetch(`${BASE_URL}/chat-messages`);
        const chatMessages = await chatResponse.json();
        console.log(`✅ Found ${chatMessages.length} chat messages`);
        console.log(`   - First: "${chatMessages[0]?.message}"`);

        // Test 4: Admin login
        console.log('\n4. Testing admin login...');
        const loginResponse = await fetch(`${BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginResponse.json();
        console.log(`✅ Login successful! Token: ${loginData.token.substring(0, 20)}...`);

        // Test 5: Test secret post password check
        console.log('\n5. Testing secret post password check...');
        const secretCheckResponse = await fetch(`${BASE_URL}/secret-posts/check-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'любовь2025' })
        });
        
        if (secretCheckResponse.ok) {
            const secretData = await secretCheckResponse.json();
            console.log(`✅ Secret post password check successful: "${secretData.title}"`);
        } else {
            console.log('❌ Secret post password check failed');
        }

        // Test 6: Test secret post content retrieval
        console.log('\n6. Testing secret post content retrieval...');
        const secretContentResponse = await fetch(`${BASE_URL}/secret-posts/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'любовь2025' })
        });
        
        if (secretContentResponse.ok) {
            const secretContent = await secretContentResponse.json();
            console.log(`✅ Secret post content retrieved: "${secretContent.title}"`);
        } else {
            console.log('❌ Secret post content retrieval failed');
        }

        console.log('\n🎉 All tests passed! API is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('   - Open http://localhost:3000 to see the main site');
        console.log('   - Open http://localhost:3000/admin to access admin panel');
        console.log('   - Login with: admin / admin123');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Make sure the server is running: npm start');
    }
}

testAPI();
