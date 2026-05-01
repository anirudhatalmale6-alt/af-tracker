var selectedFile = null;

function handleFileSelect(input) {
    var file = input.files[0];
    if (!file) return;
    var maxSize = 5 * 1024 * 1024;
    var allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.indexOf(file.type) === -1) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        input.value = '';
        return;
    }
    if (file.size > maxSize) {
        alert('File size must be under 5 MB.');
        input.value = '';
        return;
    }
    selectedFile = file;
    document.getElementById('uploadText').innerHTML = '<span class="file-name">' + file.name + '</span>';
    document.getElementById('fileUploadArea').classList.add('has-file');
}

function submitApplication() {
    var name = document.getElementById('applyName').value.trim();
    var email = document.getElementById('applyEmail').value.trim();
    var phone = document.getElementById('applyPhone').value.trim();
    var position = document.getElementById('positionSelect').value;
    var message = document.getElementById('applyMessage').value.trim();

    if (!name || !email || !phone || !position) {
        alert('Please fill in all required fields (Name, Email, Phone, Position).');
        return;
    }
    if (!selectedFile) {
        alert('Please attach your resume/CV.');
        return;
    }

    var btn = document.getElementById('applySubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    var reader = new FileReader();
    reader.onload = function() {
        var base64 = reader.result.split(',')[1];
        var payload = {
            name: name,
            email: email,
            phone: phone,
            position: position,
            message: message,
            cv_filename: selectedFile.name,
            cv_data: base64
        };

        fetch('https://advanceforensic.com/wp-json/af/v1/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(function(resp) { return resp.json(); })
        .then(function(result) {
            if (result.success) {
                document.getElementById('applyName').value = '';
                document.getElementById('applyEmail').value = '';
                document.getElementById('applyPhone').value = '';
                document.getElementById('positionSelect').value = '';
                document.getElementById('applyMessage').value = '';
                document.getElementById('applyCV').value = '';
                document.getElementById('uploadText').textContent = 'Click to upload or drag and drop';
                document.getElementById('fileUploadArea').classList.remove('has-file');
                selectedFile = null;
                document.getElementById('successPopup').classList.add('show');
            } else {
                alert('Something went wrong. Please try again or email your application to advanceforensic@gmail.com');
            }
            btn.disabled = false;
            btn.textContent = 'Submit Application';
        })
        .catch(function() {
            alert('Something went wrong. Please try again or email your application to advanceforensic@gmail.com');
            btn.disabled = false;
            btn.textContent = 'Submit Application';
        });
    };
    reader.readAsDataURL(selectedFile);
}
