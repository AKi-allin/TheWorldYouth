document.addEventListener('DOMContentLoaded', function() {
    const addModal = document.getElementById('add-stream-modal');
    const editModal = document.getElementById('edit-stream-modal');
    const deleteModal = document.getElementById('delete-modal');
    const addBtn = document.getElementById('add-stream-btn');
    const closeButtons = document.querySelectorAll('.close-button');
    const cancelDelete = document.querySelector('.cancel-delete');
    
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    const editForm = document.getElementById('edit-form');
    const deleteForm = document.getElementById('delete-form');
    
    addBtn.addEventListener('click', function() {
        addModal.style.display = 'block';
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            addModal.style.display = 'none';
            editModal.style.display = 'none';
            deleteModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === addModal) {
            addModal.style.display = 'none';
        } else if (event.target === editModal) {
            editModal.style.display = 'none';
        } else if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
    
    if (cancelDelete) {
        cancelDelete.addEventListener('click', function() {
            deleteModal.style.display = 'none';
        });
    }
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const streamId = this.getAttribute('data-id');
            
            fetch('/api/streams')
                .then(response => response.json())
                .then(data => {
                    const stream = data.streams.find(s => s.id === streamId);
                    
                    if (stream) {
                        document.getElementById('edit-title').value = stream.title;
                        document.getElementById('edit-location').value = stream.location;
                        document.getElementById('edit-latitude').value = stream.coordinates[0];
                        document.getElementById('edit-longitude').value = stream.coordinates[1];
                        document.getElementById('edit-video_url').value = stream.video_url;
                        document.getElementById('edit-thumbnail_url').value = stream.thumbnail_url;
                        document.getElementById('edit-description').value = stream.description;
                        
                        editForm.action = `/admin/edit/${streamId}`;
                        
                        editModal.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error fetching stream data:', error);
                });
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const streamId = this.getAttribute('data-id');
            
            deleteForm.action = `/admin/delete/${streamId}`;
            
            deleteModal.style.display = 'block';
        });
    });
});
