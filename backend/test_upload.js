import fetch from 'node:fetch';
import fs from 'fs';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzYyMzg5MDk5LCJleHAiOjE3NjI5OTM4OTl9.Q1Y9JTKJUAosNv1_IH0jo2BSnIAMlFw9ABrN97pvtQE';

const formData = new FormData();
formData.append('avatar', new Blob([fs.readFileSync('../test.png')]), 'test.png');

fetch('http://localhost:3000/usuarios/2/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
