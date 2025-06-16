document.addEventListener('DOMContentLoaded', function() {
    // Form, format selector and preview elements
    const nutritionForm = document.getElementById('nutritionForm');
    const labelFormat = document.getElementById('labelFormat');
    const labelPreview = document.getElementById('labelPreview');
    
    // Download buttons
    const downloadPng = document.getElementById('downloadPng');
    const downloadJpg = document.getElementById('downloadJpg');
    const downloadPdf = document.getElementById('downloadPdf');
    const saveLabel = document.getElementById('saveLabel');
    
    // Zoom buttons
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    
    // Current zoom level
    let zoomLevel = 1;
    
    // Current label data
    let currentLabelData = null;
    
    // Current label ID (when saved)
    let currentLabelId = null;
    
    // Initialize with sample data
    const sampleData = {
        product_name: "Sample Product",
        serving_size: "100",
        servings_per_container: "4",
        calories: "240",
        total_fat: "10",
        saturated_fat: "5",
        trans_fat: "0",
        cholesterol: "30",
        sodium: "430",
        total_carbs: "46",
        dietary_fiber: "3",
        total_sugars: "23",
        added_sugars: "18",
        protein: "5",
        vitamin_d: "2",
        calcium: "260",
        iron: "8",
        potassium: "400"
    };
    
    // Fill form with sample data
    fillFormWithData(sampleData);
    
    // Generate preview with sample data
    generatePreview(sampleData, 'standard');
    
    // Update preview when form is submitted
    nutritionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = getFormData();
        currentLabelData = formData;
        generatePreview(formData, labelFormat.value);
        showToast('Preview updated!');
    });
    
    // Update preview when format changes
    labelFormat.addEventListener('change', function() {
        if (currentLabelData) {
            generatePreview(currentLabelData, this.value);
        }
    });
    
    // Handle zoom in
    zoomInBtn.addEventListener('click', function() {
        zoomLevel += 0.1;
        updateZoom();
    });
    
    // Handle zoom out
    zoomOutBtn.addEventListener('click', function() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.1;
            updateZoom();
        }
    });
    
    // Handle PNG download
    downloadPng.addEventListener('click', function() {
        if (currentLabelData) {
            const format = labelFormat.value;
            downloadImage('png', format);
        } else {
            showToast('Please enter nutrition data first!', true);
        }
    });
    
    // Handle JPG download
    downloadJpg.addEventListener('click', function() {
        if (currentLabelData) {
            const format = labelFormat.value;
            downloadImage('jpg', format);
        } else {
            showToast('Please enter nutrition data first!', true);
        }
    });
    
    // Handle PDF download
    downloadPdf.addEventListener('click', function() {
        if (currentLabelData) {
            const format = labelFormat.value;
            downloadImage('pdf', format);
        } else {
            showToast('Please enter nutrition data first!', true);
        }
    });
    
    // Handle save label
    saveLabel.addEventListener('click', function() {
        if (currentLabelData) {
            const format = labelFormat.value;
            saveNutritionLabel(currentLabelData, format);
        } else {
            showToast('Please enter nutrition data first!', true);
        }
    });
    
    /**
     * Get form data as an object
     */
    function getFormData() {
        const formData = {
            product_name: document.getElementById('productName').value || '',
            serving_size: document.getElementById('servingSize').value || '0',
            servings_per_container: document.getElementById('servingsPerContainer').value || '0',
            calories: document.getElementById('calories').value || '0',
            total_fat: document.getElementById('totalFat').value || '0',
            saturated_fat: document.getElementById('saturatedFat').value || '0',
            trans_fat: document.getElementById('transFat').value || '0',
            cholesterol: document.getElementById('cholesterol').value || '0',
            sodium: document.getElementById('sodium').value || '0',
            total_carbs: document.getElementById('totalCarbs').value || '0',
            dietary_fiber: document.getElementById('dietaryFiber').value || '0',
            total_sugars: document.getElementById('totalSugars').value || '0',
            added_sugars: document.getElementById('addedSugars').value || '0',
            protein: document.getElementById('protein').value || '0',
            vitamin_d: document.getElementById('vitaminD').value || '0',
            calcium: document.getElementById('calcium').value || '0',
            iron: document.getElementById('iron').value || '0',
            potassium: document.getElementById('potassium').value || '0'
        };
        
        return formData;
    }
    
    /**
     * Fill form with data
     */
    function fillFormWithData(data) {
        document.getElementById('productName').value = data.product_name || '';
        document.getElementById('servingSize').value = data.serving_size || '';
        document.getElementById('servingsPerContainer').value = data.servings_per_container || '';
        document.getElementById('calories').value = data.calories || '';
        document.getElementById('totalFat').value = data.total_fat || '';
        document.getElementById('saturatedFat').value = data.saturated_fat || '';
        document.getElementById('transFat').value = data.trans_fat || '';
        document.getElementById('cholesterol').value = data.cholesterol || '';
        document.getElementById('sodium').value = data.sodium || '';
        document.getElementById('totalCarbs').value = data.total_carbs || '';
        document.getElementById('dietaryFiber').value = data.dietary_fiber || '';
        document.getElementById('totalSugars').value = data.total_sugars || '';
        document.getElementById('addedSugars').value = data.added_sugars || '';
        document.getElementById('protein').value = data.protein || '';
        document.getElementById('vitaminD').value = data.vitamin_d || '';
        document.getElementById('calcium').value = data.calcium || '';
        document.getElementById('iron').value = data.iron || '';
        document.getElementById('potassium').value = data.potassium || '';
    }
    
    /**
     * Generate and display label preview
     */
    function generatePreview(data, format) {
        // Show loading state
        labelPreview.innerHTML = '<div class="text-center p-4"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p class="mt-2 text-gray-600">Loading preview...</p></div>';
        
        // Prepare data for the API
        const requestData = { ...data, format };
        
        // Call preview API
        fetch('/api/preview?format=' + format + '&output_format=png', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error generating preview');
            }
            return response.blob();
        })
        .then(blob => {
            // Create an image from the blob
            const imageUrl = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.className = 'max-w-full h-auto fade-in nutrition-label ' + format + '-label';
            img.alt = 'Nutrition Label Preview';
            
            // Replace loading indicator with image
            labelPreview.innerHTML = '';
            labelPreview.appendChild(img);
        })
        .catch(error => {
            console.error('Error:', error);
            labelPreview.innerHTML = '<div class="text-center p-4 text-red-500">Error generating preview</div>';
            showToast('Error generating preview. Please try again.', true);
        });
    }
    
    /**
     * Update zoom level
     */
    function updateZoom() {
        labelPreview.style.transform = `scale(${zoomLevel})`;
    }
    
    /**
     * Download label image
     */
    function downloadImage(outputFormat, labelFormat) {
        // Show loading toast
        showToast('Preparing download...');
        
        // Call API to create the file
        fetch('/api/preview?format=' + labelFormat + '&output_format=' + outputFormat, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...currentLabelData,
                format: labelFormat
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error generating file');
            }
            return response.blob();
        })
        .then(blob => {
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `nutrition-label.${outputFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            showToast(`${outputFormat.toUpperCase()} downloaded successfully!`);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error generating file. Please try again.', true);
        });
    }
    
    /**
     * Save nutrition label to database
     */
    function saveNutritionLabel(data, format) {
        // Show loading toast
        showToast('Saving label...');
        
        // Call API to save the label
        fetch('/api/labels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                format: format
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error saving label');
            }
            return response.json();
        })
        .then(data => {
            currentLabelId = data.id;
            showToast('Label saved successfully! ID: ' + data.id);
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Error saving label. Please try again.', true);
        });
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, isError = false) {
        // Check if toast element exists
        let toast = document.querySelector('.toast');
        
        // Create toast if it doesn't exist
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set message and display toast
        toast.textContent = message;
        
        // Add or remove error class
        if (isError) {
            toast.classList.add('error');
        } else {
            toast.classList.remove('error');
        }
        
        // Show the toast
        toast.classList.remove('show');
        void toast.offsetWidth; // Trigger reflow
        toast.classList.add('show');
        
        // Hide toast after animation
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});