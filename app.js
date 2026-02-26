// 文件列表
let uploadFiles = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initUploadArea();
    loadRecords();
    initForm();
});

// 初始化上传区域
function initUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // 拖拽事件
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // 点击选择文件
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// 处理文件
function handleFiles(files) {
    const maxSize = 20 * 1024 * 1024; // 20MB
    
    for (let file of files) {
        if (file.size > maxSize) {
            showToast(`文件 ${file.name} 超过20MB限制`);
            continue;
        }
        
        // 检查是否已存在
        if (uploadFiles.find(f => f.name === file.name)) {
            showToast(`文件 ${file.name} 已添加`);
            continue;
        }
        
        uploadFiles.push(file);
    }
    
    renderFileList();
}

// 渲染文件列表
function renderFileList() {
    const fileList = document.getElementById('fileList');
    
    if (uploadFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadFiles.map((file, index) => `
        <div class="file-item">
            <span class="file-icon">${getFileIcon(file.name)}</span>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">×</button>
        </div>
    `).join('');
}

// 获取文件图标
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'xls': '📊',
        'xlsx': '📊',
        'ppt': '📑',
        'pptx': '📑',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'zip': '📦',
        'rar': '📦'
    };
    return icons[ext] || '📁';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// 移除文件
function removeFile(index) {
    uploadFiles.splice(index, 1);
    renderFileList();
}

// 初始化表单
function initForm() {
    const form = document.getElementById('uploadForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitHomework();
    });
}

// 提交作业
function submitHomework() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const className = document.getElementById('className').value;
    const subject = document.getElementById('subject').value;
    const homeworkTitle = document.getElementById('homeworkTitle').value.trim();
    const description = document.getElementById('description').value.trim();

   if (!studentName || !subject || !homeworkTitle) {
    if (!studentName || !studentId || !className || !subject || !homeworkTitle) {
        showToast('请填写所有必填项');
        return;
    }

    if (uploadFiles.length === 0) {
        showToast('请上传至少一个文件');
        return;
    }

    // 模拟提交
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'inline';

    setTimeout(() => {
        // 保存记录
        const record = {
            id: Date.now(),
            studentName,
            studentId,
            className,
            subject,
            homeworkTitle,
            description,
            files: uploadFiles.map(f => ({ name: f.name, size: f.size })),
            submitTime: new Date().toLocaleString(),
            status: 'submitted'
        };

        let records = JSON.parse(localStorage.getItem('homework_records')) || [];
        records.unshift(record);
        localStorage.setItem('homework_records', JSON.stringify(records));

        // 重置表单
        document.getElementById('uploadForm').reset();
        uploadFiles = [];
        renderFileList();
        loadRecords();

        // 恢复按钮
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loading').style.display = 'none';

        // 显示成功弹窗
        document.getElementById('successModal').classList.add('show');
    }, 1500);
}

// 关闭弹窗
function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

// 加载提交记录
function loadRecords() {
    const records = JSON.parse(localStorage.getItem('homework_records')) || [];
    const recordsList = document.getElementById('recordsList');

    if (records.length === 0) {
        recordsList.innerHTML = '<div class="empty-records">暂无提交记录</div>';
        return;
    }

    recordsList.innerHTML = records.slice(0, 10).map(record => `
        <div class="record-item">
            <div class="record-info">
                <h4>${record.homeworkTitle}</h4>
                <div class="record-meta">
                    <span>📚 ${record.subject}</span>
                    <span>🏫 ${record.className}</span>
                    <span>🕐 ${record.submitTime}</span>
                </div>
            </div>
            <span class="record-status ${record.status === 'reviewed' ? 'status-reviewed' : 'status-submitted'}">
                ${record.status === 'reviewed' ? '已批阅' : '已提交'}
            </span>
        </div>
    `).join('');
}

// Toast提示
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
