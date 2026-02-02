/**
 * VirtualBox Web Clone Layout Logic
 */

class VirtualMachineManager {
    constructor() {
        this.vms = JSON.parse(localStorage.getItem('vb_vms') || '[]');
        this.selectedVmIndex = -1;

        this.initElements();
        this.addEventListeners();
        this.renderVMList();
    }

    initElements() {
        // Toolbar
        this.btnNew = document.getElementById('btn-new');
        this.btnSettings = document.getElementById('btn-settings');
        this.btnStart = document.getElementById('btn-start');

        // Sidebar
        this.vmList = document.getElementById('vm-list');

        // Main Area
        this.detailsPane = document.getElementById('details-pane');
        this.emptyState = this.detailsPane.querySelector('.empty-state');
        this.vmDetails = document.getElementById('vm-active-details');
        
        // Detail Fields
        this.detailName = document.getElementById('detail-name');
        this.infoName = document.getElementById('info-name');
        this.infoUrl = document.getElementById('info-url');

        // Modal
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        this.modalCancel = document.getElementById('modal-cancel');
        this.modalCreate = document.getElementById('modal-create');
        
        this.inputName = document.getElementById('vm-name-input');
        this.inputUrl = document.getElementById('vm-url-input');
    }

    addEventListeners() {
        // Toolbar actions
        this.btnNew.addEventListener('click', () => this.openModal());
        this.btnStart.addEventListener('click', () => this.startVM());

        // Modal actions
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modalCancel.addEventListener('click', () => this.closeModal());
        this.modalCreate.addEventListener('click', () => this.createVM());
        
        // Close modal on click outside
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.closeModal();
        });
    }

    renderVMList() {
        this.vmList.innerHTML = '';
        
        this.vms.forEach((vm, index) => {
            const li = document.createElement('li');
            li.className = `vm-item ${index === this.selectedVmIndex ? 'selected' : ''}`;
            li.innerHTML = `
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Web_Hypertext_Concept_Icon.svg" class="vm-icon-small" alt="web">
                <span class="vm-name-text">${vm.name}</span>
                <div class="vm-status-dot ${vm.running ? 'running' : ''}"></div>
            `;
            li.addEventListener('click', () => this.selectVM(index));
            this.vmList.appendChild(li);
        });

        this.updateToolbarState();
        this.updateDetailsView();
    }

    selectVM(index) {
        this.selectedVmIndex = index;
        this.renderVMList(); // Re-render to update selection style
    }

    updateToolbarState() {
        const isSelected = this.selectedVmIndex !== -1;
        this.btnStart.disabled = !isSelected;
        this.btnSettings.disabled = !isSelected;
    }

    updateDetailsView() {
        if (this.selectedVmIndex === -1) {
            this.emptyState.classList.remove('hidden');
            this.vmDetails.classList.add('hidden');
        } else {
            const vm = this.vms[this.selectedVmIndex];
            this.emptyState.classList.add('hidden');
            this.vmDetails.classList.remove('hidden');

            this.detailName.textContent = vm.name;
            this.infoName.textContent = vm.name;
            this.infoUrl.textContent = vm.url;
        }
    }

    openModal() {
        this.inputName.value = '';
        this.inputUrl.value = '';
        this.modalOverlay.classList.remove('hidden');
        this.inputName.focus();
    }

    closeModal() {
        this.modalOverlay.classList.add('hidden');
    }

    createVM() {
        const name = this.inputName.value.trim();
        let url = this.inputUrl.value.trim();

        if (!name || !url) {
            alert('Per favore inserisci sia il nome che l\'URL.');
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newVM = {
            name: name,
            url: url,
            created: new Date().toISOString(),
            running: false
        };

        this.vms.push(newVM);
        this.saveData();
        this.closeModal();
        this.selectVM(this.vms.length - 1); // Select the new VM
    }

    startVM() {
        if (this.selectedVmIndex === -1) return;
        
        const vm = this.vms[this.selectedVmIndex];
        
        // Simulating "Booting"
        const dot = this.vmList.children[this.selectedVmIndex].querySelector('.vm-status-dot');
        dot.classList.add('running'); // visual feedback immediately

        // Open in new tab (The "VM" window)
        window.open(vm.url, '_blank');
    }

    saveData() {
        localStorage.setItem('vb_vms', JSON.stringify(this.vms));
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VirtualMachineManager();
});
