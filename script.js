// ========== USER DATABASE WITH PERMANENT STORAGE ==========
// Load users from localStorage or use defaults
function loadUsers() {
    // ALWAYS USE DEFAULT USERS - This ensures Mary's credentials always work
    const defaultUsers = [
        { username: 'john', password: 'demo123', fullName: 'John', email: 'john@example.com', accountType: 'Chase Total Checking®' },
        { username: 'james', password: 'demo123', fullName: 'James', email: 'james@example.com', accountType: 'Chase Savings℠' },
        { username: 'marymarquez88', password: 'Juniper.7783', fullName: 'Mary Marquez', email: 'mary@example.com', accountType: 'Chase Freedom Unlimited®' },
        { username: 'marymarquez', password: '7783', fullName: 'Mary', email: 'mary@example.com', accountType: 'Chase Total Checking®' }
    ];
    
    // Save to localStorage
    localStorage.setItem('bankUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('bankUsers', JSON.stringify(users));
}

// Initialize users
let users = loadUsers();

let currentUser = null;
let currentSlide = 0;
let slideInterval;

// ========== LOADING OVERLAY ==========
function showLoading(message = 'Processing...') {
    hideLoading();
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
        transition: opacity 0.3s;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px;
        height: 60px;
        border: 4px solid #E6F0FA;
        border-top: 4px solid #0B5394;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    `;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        font-size: 1.2rem;
        color: #0B5394;
        font-weight: 500;
        animation: pulse 1.5s ease-in-out infinite;
    `;
    messageEl.textContent = message;
    
    const subMessageEl = document.createElement('div');
    subMessageEl.style.cssText = `
        font-size: 0.9rem;
        color: #4A5568;
        margin-top: 10px;
    `;
    subMessageEl.textContent = 'Please wait...';
    
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(messageEl);
    loadingOverlay.appendChild(subMessageEl);
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const existingOverlay = document.getElementById('loadingOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
}

// ========== FEATURE MODAL ==========
function showFeatureModal(title, content, action = null) {
    // Remove existing modal if any
    const existingModal = document.getElementById('featureModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'featureModal';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
        background: white;
        border-radius: 20px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease-out;
    `;
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        background: linear-gradient(135deg, #0B5394, #062E4F);
        color: white;
        padding: 20px 24px;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const modalTitle = document.createElement('h2');
    modalTitle.style.cssText = `
        font-size: 1.3rem;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    modalTitle.innerHTML = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    `;
    closeBtn.onmouseover = () => {
        closeBtn.style.background = 'rgba(255,255,255,0.3)';
    };
    closeBtn.onmouseout = () => {
        closeBtn.style.background = 'rgba(255,255,255,0.2)';
    };
    closeBtn.onclick = () => {
        modalOverlay.remove();
    };
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);
    
    // Create modal body
    const modalBody = document.createElement('div');
    modalBody.style.cssText = `
        padding: 24px;
    `;
    modalBody.innerHTML = content;
    
    // Create modal footer if action exists
    if (action) {
        const modalFooter = document.createElement('div');
        modalFooter.style.cssText = `
            padding: 20px 24px;
            border-top: 1px solid #E5E5E5;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        `;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            background: none;
            border: 1px solid #CBD5E0;
            color: #4A5568;
            padding: 10px 24px;
            border-radius: 40px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        `;
        cancelBtn.onmouseover = () => {
            cancelBtn.style.background = '#F7F7F7';
        };
        cancelBtn.onmouseout = () => {
            cancelBtn.style.background = 'none';
        };
        cancelBtn.onclick = () => {
            modalOverlay.remove();
        };
        
        const actionBtn = document.createElement('button');
        actionBtn.textContent = action.text;
        actionBtn.style.cssText = `
            background: #0B5394;
            border: none;
            color: white;
            padding: 10px 24px;
            border-radius: 40px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        `;
        actionBtn.onmouseover = () => {
            actionBtn.style.background = '#0A3D6B';
        };
        actionBtn.onmouseout = () => {
            actionBtn.style.background = '#0B5394';
        };
        actionBtn.onclick = () => {
            modalOverlay.remove();
            if (action.handler) {
                action.handler();
            } else {
                showLoading('Processing...');
                setTimeout(() => {
                    hideLoading();
                    alert(action.message || 'Action completed successfully!');
                }, 1500);
            }
        };
        
        modalFooter.appendChild(cancelBtn);
        modalFooter.appendChild(actionBtn);
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
        modalContainer.appendChild(modalFooter);
    } else {
        modalContainer.appendChild(modalHeader);
        modalContainer.appendChild(modalBody);
    }
    
    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);
    
    // Add close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// ========== FEATURE-SPECIFIC FUNCTIONS ==========

// Send Money Feature
function showSendMoney() {
    const content = `
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Select recipient</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>John Doe (john.doe@email.com)</option>
                <option>Sarah Smith (sarah.s@email.com)</option>
                <option>Michael Chen (m.chen@email.com)</option>
                <option>Add new recipient...</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Amount</label>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 1.2rem; margin-right: 8px;">$</span>
                <input type="number" placeholder="0.00" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">From account</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>Everyday Checking (····4321) - $3,450.87</option>
                <option>Savings Account (····9876) - $8,999.45</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Memo (optional)</label>
            <input type="text" placeholder="e.g., Dinner, Rent, etc." style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-paper-plane"></i> Send Money',
        content,
        { text: 'Send Payment', message: 'Payment sent successfully!' }
    );
}

// Pay Bills Feature
function showPayBills() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <h4 style="color: #0B5394; margin-bottom: 10px;">Upcoming Bills</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Chase Freedom Card</span>
                    <span style="font-weight: 600;">$450.22</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Electric Bill</span>
                    <span style="font-weight: 600;">$85.40</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Internet Bill</span>
                    <span style="font-weight: 600;">$65.99</span>
                </div>
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Select payee</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>Chase Freedom Card</option>
                <option>Electric Company</option>
                <option>Internet Provider</option>
                <option>Water Utility</option>
                <option>Add new payee...</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Amount</label>
            <input type="number" placeholder="Enter amount" style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Schedule payment</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Schedule for later...</option>
                <option>Recurring monthly</option>
            </select>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-file-invoice"></i> Pay Bills',
        content,
        { text: 'Schedule Payment', message: 'Payment scheduled successfully!' }
    );
}

// Deposit Check Feature
function showDepositCheck() {
    const content = `
        <div style="margin-bottom: 20px; text-align: center;">
            <div style="background: #F0F5FE; padding: 30px; border-radius: 12px; margin-bottom: 20px; border: 2px dashed #0B5394;">
                <i class="fas fa-camera" style="font-size: 3rem; color: #0B5394; margin-bottom: 10px;"></i>
                <h4 style="color: #0B5394; margin-bottom: 5px;">Take a photo of your check</h4>
                <p style="color: #6B7A8D; font-size: 0.9rem;">Front of check</p>
                <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 10px; border: 1px solid #CBD5E0;">
                    <i class="fas fa-plus-circle" style="color: #0B5394;"></i> Tap to take photo
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 30px; border-radius: 12px; margin-bottom: 20px; border: 2px dashed #0B5394;">
                <h4 style="color: #0B5394; margin-bottom: 5px;">Back of check</h4>
                <div style="background: white; padding: 10px; border-radius: 8px; margin-top: 10px; border: 1px solid #CBD5E0;">
                    <i class="fas fa-plus-circle" style="color: #0B5394;"></i> Tap to take photo
                </div>
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748; text-align: left;">Deposit to</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                <option>Everyday Checking (····4321)</option>
                <option>Savings Account (····9876)</option>
            </select>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-camera"></i> Deposit Check',
        content,
        { text: 'Deposit Check', message: 'Check deposit submitted! Funds will be available in 1-2 business days.' }
    );
}

// Transfer Money Feature
function showTransfer() {
    const content = `
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">From account</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>Everyday Checking (····4321) - $3,450.87</option>
                <option>Savings Account (····9876) - $8,999.45</option>
                <option>Freedom Credit Card (····1234) - $450.22</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">To account</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>Savings Account (····9876)</option>
                <option>Everyday Checking (····4321)</option>
                <option>Add external account...</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Amount</label>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 1.2rem; margin-right: 8px;">$</span>
                <input type="number" placeholder="0.00" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Transfer date</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Next business day</option>
                <option>Schedule for later...</option>
            </select>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-exchange-alt"></i> Transfer Money',
        content,
        { text: 'Transfer', message: 'Transfer completed successfully!' }
    );
}

// Credit Card Details
function showCreditCard() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #0B5394, #062E4F); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                    <span>Chase Freedom Unlimited®</span>
                    <span><i class="fab fa-cc-visa" style="font-size: 1.5rem;"></i></span>
                </div>
                <div style="font-size: 1.3rem; margin-bottom: 15px;">···· ···· ···· 1234</div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Valid Thru 08/28</span>
                    <span>${currentUser?.fullName || 'Cardholder'}</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.9rem; color: #6B7A8D;">Current Balance</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0A2540;">$450.22</div>
                </div>
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.9rem; color: #6B7A8D;">Available Credit</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0A2540;">$4,549.78</div>
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Credit Limit</span>
                    <span style="font-weight: 600;">$5,000</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Interest Rate (APR)</span>
                    <span style="font-weight: 600;">18.24%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Rewards Earned</span>
                    <span style="font-weight: 600; color: #0B5394;">$23.45 cash back</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button style="flex: 1; background: #0B5394; color: white; border: none; padding: 12px; border-radius: 40px; font-weight: 600; cursor: pointer;">Make Payment</button>
                <button style="flex: 1; background: white; color: #0B5394; border: 1px solid #0B5394; padding: 12px; border-radius: 40px; font-weight: 600; cursor: pointer;">View Transactions</button>
            </div>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-credit-card"></i> Credit Card Details',
        content
    );
}

// Investments Feature
function showInvestments() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="font-weight: 600;">Portfolio Value</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #0A2540;">$25,430.50</span>
                </div>
                <div style="display: flex; gap: 20px;">
                    <span style="color: #2C9A4C;"><i class="fas fa-arrow-up"></i> +3.2%</span>
                    <span style="color: #6B7A8D;">Today's change</span>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">Your Holdings</h4>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div>
                        <span style="font-weight: 600;">Vanguard 500 Index</span>
                        <span style="font-size: 0.8rem; color: #6B7A8D; display: block;">VFIAX</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight: 600;">$12,450.00</span>
                        <span style="color: #2C9A4C; font-size: 0.8rem; display: block;">+2.1%</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div>
                        <span style="font-weight: 600;">iShares Core S&P 500</span>
                        <span style="font-size: 0.8rem; color: #6B7A8D; display: block;">IVV</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight: 600;">$8,230.75</span>
                        <span style="color: #2C9A4C; font-size: 0.8rem; display: block;">+1.8%</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div>
                        <span style="font-weight: 600;">Apple Inc.</span>
                        <span style="font-size: 0.8rem; color: #6B7A8D; display: block;">AAPL</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight: 600;">$4,749.75</span>
                        <span style="color: #D14545; font-size: 0.8rem; display: block;">-0.5%</span>
                    </div>
                </div>
            </div>
            
            <button style="width: 100%; background: #0B5394; color: white; border: none; padding: 14px; border-radius: 40px; font-weight: 600; margin-top: 10px; cursor: pointer;">Trade</button>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-chart-line"></i> Investments',
        content
    );
}

// Financial Goals Feature
function showFinancialGoals() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-umbrella-beach" style="font-size: 2rem; color: #0B5394;"></i>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 5px;">Vacation Fund</h4>
                        <div style="height: 8px; background: #E0E8F5; border-radius: 4px; overflow: hidden;">
                            <div style="width: 40%; height: 100%; background: #0B5394;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span style="font-size: 0.8rem;">$1,200 of $3,000</span>
                            <span style="font-size: 0.8rem; font-weight: 600;">40%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-car" style="font-size: 2rem; color: #0B5394;"></i>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 5px;">New Car</h4>
                        <div style="height: 8px; background: #E0E8F5; border-radius: 4px; overflow: hidden;">
                            <div style="width: 33%; height: 100%; background: #0B5394;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span style="font-size: 0.8rem;">$5,000 of $15,000</span>
                            <span style="font-size: 0.8rem; font-weight: 600;">33%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-home" style="font-size: 2rem; color: #0B5394;"></i>
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 5px;">Emergency Fund</h4>
                        <div style="height: 8px; background: #E0E8F5; border-radius: 4px; overflow: hidden;">
                            <div style="width: 60%; height: 100%; background: #0B5394;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span style="font-size: 0.8rem;">$6,000 of $10,000</span>
                            <span style="font-size: 0.8rem; font-weight: 600;">60%</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <button style="width: 100%; background: #0B5394; color: white; border: none; padding: 14px; border-radius: 40px; font-weight: 600; cursor: pointer;">Create New Goal</button>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-bullseye"></i> Financial Goals',
        content
    );
}

// Rewards Feature
function showRewards() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #0B5394, #062E4F); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 5px;">2,450</div>
                <div style="font-size: 1rem;">Rewards Points</div>
                <div style="margin-top: 10px; background: rgba(255,255,255,0.2); padding: 8px; border-radius: 20px;">
                    ≈ $24.50 value
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">Redeem for</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center; cursor: pointer;">
                    <i class="fas fa-coffee" style="font-size: 1.5rem; color: #0B5394; margin-bottom: 5px;"></i>
                    <div style="font-weight: 600;">Gift Cards</div>
                    <div style="font-size: 0.8rem;">From 500 pts</div>
                </div>
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center; cursor: pointer;">
                    <i class="fas fa-plane" style="font-size: 1.5rem; color: #0B5394; margin-bottom: 5px;"></i>
                    <div style="font-weight: 600;">Travel</div>
                    <div style="font-size: 0.8rem;">From 1,000 pts</div>
                </div>
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center; cursor: pointer;">
                    <i class="fas fa-gift" style="font-size: 1.5rem; color: #0B5394; margin-bottom: 5px;"></i>
                    <div style="font-weight: 600;">Merchandise</div>
                    <div style="font-size: 0.8rem;">From 2,000 pts</div>
                </div>
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; text-align: center; cursor: pointer;">
                    <i class="fas fa-dollar-sign" style="font-size: 1.5rem; color: #0B5394; margin-bottom: 5px;"></i>
                    <div style="font-weight: 600;">Cash Back</div>
                    <div style="font-size: 0.8rem;">2,450 pts = $24.50</div>
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px;">
                <h5 style="margin-bottom: 10px;">Recent Activity</h5>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                    <span>Starbucks purchase</span>
                    <span style="color: #0B5394;">+15 pts</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-top: 5px;">
                    <span>Whole Foods Market</span>
                    <span style="color: #0B5394;">+87 pts</span>
                </div>
            </div>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-gem"></i> Rewards',
        content
    );
}

// Calculator Features
function showMortgageCalculator() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <span style="font-weight: 600;">Monthly Payment</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: #0B5394;">$1,656</span>
                </div>
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Loan Amount</label>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 1.2rem; margin-right: 8px;">$</span>
                <input type="number" value="300000" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Interest Rate (%)</label>
            <input type="number" value="5.25" step="0.125" style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Loan Term</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>15 years</option>
                <option selected>30 years</option>
                <option>Other...</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Down Payment</label>
            <input type="number" value="60000" style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-calculator"></i> Mortgage Calculator',
        content,
        { text: 'Calculate', message: 'Based on your inputs, your estimated monthly payment is $1,656' }
    );
}

function showBudgetPlanner() {
    const content = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 15px;">Monthly Budget Summary</h4>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Income</span>
                    <span style="font-weight: 600;">$5,200</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Expenses</span>
                    <span style="font-weight: 600;">$4,200</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E5E5E5;">
                    <span style="font-weight: 600;">Remaining</span>
                    <span style="font-weight: 700; color: #2C9A4C;">$1,000</span>
                </div>
            </div>
            
            <h5 style="margin: 15px 0 10px;">Spending by Category</h5>
            
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Housing</span>
                    <span>$1,500</span>
                </div>
                <div style="height: 6px; background: #E0E8F5; border-radius: 3px;">
                    <div style="width: 70%; height: 100%; background: #0B5394; border-radius: 3px;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Food & Dining</span>
                    <span>$600</span>
                </div>
                <div style="height: 6px; background: #E0E8F5; border-radius: 3px;">
                    <div style="width: 60%; height: 100%; background: #FFB347; border-radius: 3px;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Transportation</span>
                    <span>$400</span>
                </div>
                <div style="height: 6px; background: #E0E8F5; border-radius: 3px;">
                    <div style="width: 80%; height: 100%; background: #47B5FF; border-radius: 3px;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Shopping</span>
                    <span>$300</span>
                </div>
                <div style="height: 6px; background: #E0E8F5; border-radius: 3px;">
                    <div style="width: 30%; height: 100%; background: #A3A8F0; border-radius: 3px;"></div>
                </div>
            </div>
            
            <button style="width: 100%; background: #0B5394; color: white; border: none; padding: 14px; border-radius: 40px; font-weight: 600; margin-top: 15px; cursor: pointer;">Create New Budget</button>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-chart-pie"></i> Budget Planner',
        content
    );
}

function showCreditScore() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #0B5394, #062E4F); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 3rem; font-weight: 700; margin-bottom: 5px;">785</div>
                <div style="font-size: 1.2rem; margin-bottom: 10px;">Excellent</div>
                <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 20px; font-size: 0.9rem;">
                    <i class="fas fa-arrow-up"></i> +15 from last month
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px;">
                    <div style="font-size: 0.9rem; color: #6B7A8D;">Payment History</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: #0A2540;">100%</div>
                    <div style="font-size: 0.8rem;">On time</div>
                </div>
                <div style="background: #F0F5FE; padding: 15px; border-radius: 12px;">
                    <div style="font-size: 0.9rem; color: #6B7A8D;">Credit Utilization</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: #0A2540;">23%</div>
                    <div style="font-size: 0.8rem;">Good</div>
                </div>
            </div>
            
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px;">
                <h5 style="margin-bottom: 10px;">Factors affecting your score</h5>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="fas fa-check-circle" style="color: #2C9A4C;"></i>
                    <span>On-time payments</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <i class="fas fa-check-circle" style="color: #2C9A4C;"></i>
                    <span>Low credit utilization</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-exclamation-circle" style="color: #FFB347;"></i>
                    <span>Credit age (3 years)</span>
                </div>
            </div>
            
            <button style="width: 100%; background: #0B5394; color: white; border: none; padding: 14px; border-radius: 40px; font-weight: 600; margin-top: 15px; cursor: pointer;">View Full Report</button>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-credit-card"></i> Credit Score',
        content
    );
}

function showBranchLocator() {
    const content = `
        <div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <input type="text" placeholder="Enter ZIP code or city" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                    <button style="background: #0B5394; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer;">Search</button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="background: #E0E8F5; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem;">Near me</span>
                    <span style="background: #E0E8F5; padding: 5px 10px; border-radius: 20px; font-size: 0.8rem;">ATMs only</span>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px;">Nearby Locations</h4>
            
            <div style="border: 1px solid #E5E5E5; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <h5 style="margin-bottom: 5px;">Chase Bank - Downtown</h5>
                        <p style="font-size: 0.9rem; color: #6B7A8D;">123 Main St, New York, NY 10001</p>
                        <p style="font-size: 0.8rem; color: #2C9A4C;"><i class="fas fa-map-marker-alt"></i> 0.5 miles away</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="background: #2C9A4C; color: white; padding: 4px 8px; border-radius: 20px; font-size: 0.7rem;">Open</span>
                        <p style="font-size: 0.8rem; margin-top: 5px;">Closes 6:00 PM</p>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <span style="background: #E0E8F5; padding: 3px 8px; border-radius: 20px; font-size: 0.7rem;">ATM</span>
                    <span style="background: #E0E8F5; padding: 3px 8px; border-radius: 20px; font-size: 0.7rem;">Drive-thru</span>
                </div>
            </div>
            
            <div style="border: 1px solid #E5E5E5; border-radius: 12px; padding: 15px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <h5 style="margin-bottom: 5px;">Chase Bank - Financial District</h5>
                        <p style="font-size: 0.9rem; color: #6B7A8D;">456 Wall St, New York, NY 10005</p>
                        <p style="font-size: 0.8rem; color: #2C9A4C;"><i class="fas fa-map-marker-alt"></i> 1.2 miles away</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="background: #2C9A4C; color: white; padding: 4px 8px; border-radius: 20px; font-size: 0.7rem;">Open</span>
                        <p style="font-size: 0.8rem; margin-top: 5px;">Closes 5:30 PM</p>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <span style="background: #E0E8F5; padding: 3px 8px; border-radius: 20px; font-size: 0.7rem;">ATM</span>
                    <span style="background: #E0E8F5; padding: 3px 8px; border-radius: 20px; font-size: 0.7rem;">Notary</span>
                </div>
            </div>
            
            <div style="border: 1px solid #E5E5E5; border-radius: 12px; padding: 15px;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <h5 style="margin-bottom: 5px;">ATM - 24/7 Access</h5>
                        <p style="font-size: 0.9rem; color: #6B7A8D;">789 Broadway, New York, NY 10003</p>
                        <p style="font-size: 0.8rem; color: #2C9A4C;"><i class="fas fa-map-marker-alt"></i> 0.8 miles away</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="background: #2C9A4C; color: white; padding: 4px 8px; border-radius: 20px; font-size: 0.7rem;">24/7</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showFeatureModal(
        '<i class="fas fa-university"></i> Find a Branch',
        content
    );
}

// ========== SLIDER FUNCTIONS ==========
function changeSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlide = index;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    changeSlide(nextIndex);
}

function startSlider() {
    if (document.querySelectorAll('.slide').length > 0) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

// ========== PASSWORD TOGGLE FUNCTIONS ==========
function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
}

function toggleModalPassword() {
    const passwordInput = document.getElementById('modalPassword');
    const toggleIcon = document.getElementById('modalPasswordToggleIcon');
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
}

function toggleNewPassword() {
    const passwordInput = document.getElementById('newPassword');
    const toggleIcon = document.getElementById('newPasswordToggleIcon');
    
    if (passwordInput && toggleIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }
}

// ========== MODAL FUNCTIONS ==========
function showLoginModal() {
    showLoading('Opening sign in...');
    
    setTimeout(() => {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
        hideLoading();
    }, 800);
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showOpenAccount() {
    showLoading('Preparing application...');
    
    setTimeout(() => {
        const modal = document.getElementById('openAccountModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
        hideLoading();
    }, 1000);
}

function hideOpenAccount() {
    const modal = document.getElementById('openAccountModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// ========== ACCOUNT CREATION (NOW PERMANENT) ==========
function createAccount(event) {
    if (event) {
        event.preventDefault();
    }
    
    const fullName = document.getElementById('fullName')?.value.trim();
    const username = document.getElementById('newUsername')?.value.trim();
    const password = document.getElementById('newPassword')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const accountType = document.getElementById('accountType')?.value;

    if (!fullName || !username || !password) {
        alert('Please fill in all required fields');
        return false;
    }

    if (users.find(u => u.username === username)) {
        alert('Username already exists. Please choose another.');
        return false;
    }

    showLoading('Creating your account...');

    setTimeout(() => {
        const firstName = fullName.split(' ')[0];

        const newUser = {
            username: username,
            password: password,
            fullName: firstName,
            email: email,
            accountType: accountType
        };

        // Add to users array
        users.push(newUser);
        
        // SAVE TO LOCALSTORAGE - THIS MAKES IT PERMANENT
        saveUsers(users);

        hideLoading();

        alert(`✅ Account Created Successfully!\n\nName: ${fullName}\nUsername: ${username}\nAccount Type: ${accountType}\n\nYou can now login with your username and password. This account is now permanent and will still work after page refresh.`);

        // Clear form fields
        document.getElementById('fullName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone') ? document.getElementById('phone').value = '' : null;
        document.getElementById('newUsername').value = '';
        document.getElementById('newPassword').value = '';
        
        // Close modal
        hideOpenAccount();
        
    }, 2500);
    
    return false;
}

// ========== LOGIN FUNCTIONS ==========
function handleLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const username = document.getElementById('loginUsername')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();

    if (!username || !password) {
        alert('Please enter both username and password');
        return false;
    }

    showLoading('Verifying credentials...');

    setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            
            showLoading('Loading your dashboard...');
            
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                fullName: user.fullName,
                email: user.email || '',
                accountType: user.accountType || 'Chase Total Checking®'
            }));
            
            setTimeout(() => {
                hideLoading();
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            hideLoading();
            alert('❌ Invalid username or password. Please try again.');
        }
    }, 2000);
    
    return false;
}

function handleModalLogin(event) {
    if (event) {
        event.preventDefault();
    }
    
    const username = document.getElementById('modalUsername')?.value.trim();
    const password = document.getElementById('modalPassword')?.value.trim();

    if (!username || !password) {
        alert('Please enter both username and password');
        return false;
    }

    showLoading('Verifying credentials...');

    setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            currentUser = user;
            
            showLoading('Loading your dashboard...');
            
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                fullName: user.fullName,
                email: user.email || '',
                accountType: user.accountType || 'Chase Total Checking®'
            }));
            
            setTimeout(() => {
                hideLoading();
                hideLoginModal();
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            hideLoading();
            alert('❌ Invalid username or password. Please try again.');
        }
    }, 2000);
    
    return false;
}

// ========== DASHBOARD FUNCTIONS ==========
function loadDashboardUser() {
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        showLoading('Loading your account information...');
        
        setTimeout(() => {
            const userNameDisplay = document.getElementById('userNameDisplay');
            const profileInitial = document.getElementById('dashboardProfileInitial');
            const userNameBanner = document.getElementById('userNameBanner');
            
            if (userNameDisplay) {
                userNameDisplay.textContent = user.fullName;
            }
            
            if (profileInitial) {
                profileInitial.textContent = user.fullName.charAt(0).toUpperCase();
            }
            
            if (userNameBanner) {
                userNameBanner.textContent = user.fullName;
            }
            
            hideLoading();
        }, 1800);
        
    } else {
        window.location.href = 'index.html';
    }
}

function logout() {
    showLoading('Signing out...');
    
    setTimeout(() => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        hideLoading();
        window.location.href = 'index.html';
    }, 1500);
}

// ========== QUICK ACTION FUNCTIONS ==========
function handleQuickAction(action) {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('send')) {
        showSendMoney();
    } else if (actionLower.includes('bill')) {
        showPayBills();
    } else if (actionLower.includes('deposit')) {
        showDepositCheck();
    } else if (actionLower.includes('transfer')) {
        showTransfer();
    } else if (actionLower.includes('credit')) {
        showCreditCard();
    } else if (actionLower.includes('invest')) {
        showInvestments();
    } else {
        showLoading(`Processing ${action}...`);
        setTimeout(() => {
            hideLoading();
            showFeatureModal(
                '<i class="fas fa-info-circle"></i> Feature Demo',
                `<p style="margin: 20px 0; text-align: center;">This is a demo of the "${action}" feature. In a real bank, this would open a detailed page with full functionality.</p>`
            );
        }, 1500);
    }
}

function schedulePayment(billName, amount) {
    showPayBills();
}

function filterTransactions() {
    showFeatureModal(
        '<i class="fas fa-filter"></i> Filter Transactions',
        `<div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Date Range</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
                <option>Custom range</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Category</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>All categories</option>
                <option>Dining</option>
                <option>Groceries</option>
                <option>Shopping</option>
                <option>Transportation</option>
                <option>Entertainment</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Amount Range</label>
            <div style="display: flex; gap: 10px;">
                <input type="number" placeholder="Min" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                <input type="number" placeholder="Max" style="flex: 1; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
            </div>
        </div>`,
        { text: 'Apply Filters', message: 'Filters applied successfully!' }
    );
}

function downloadStatement() {
    showFeatureModal(
        '<i class="fas fa-download"></i> Download Statement',
        `<div style="margin-bottom: 20px;">
            <div style="background: #F0F5FE; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>January 2026 Statement</span>
                    <span style="color: #0B5394; cursor: pointer;"><i class="fas fa-download"></i> Download</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>December 2025 Statement</span>
                    <span style="color: #0B5394; cursor: pointer;"><i class="fas fa-download"></i> Download</span>
                </div>
            </div>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Select Statement Period</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px; margin-bottom: 15px;">
                <option>January 2026</option>
                <option>December 2025</option>
                <option>November 2025</option>
                <option>Custom range...</option>
            </select>
            
            <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #2D3748;">Format</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #CBD5E0; border-radius: 8px;">
                <option>PDF</option>
                <option>CSV</option>
                <option>Excel</option>
            </select>
        </div>`,
        { text: 'Download', message: 'Your statement is being generated and will download shortly.' }
    );
}

function checkCreditScore() {
    showCreditScore();
}

function findBranch() {
    showBranchLocator();
}

function calculateMortgage() {
    showMortgageCalculator();
}

function openBudgetPlanner() {
    showBudgetPlanner();
}

function redeemRewards() {
    showRewards();
}

function setFinancialGoal() {
    showFinancialGoals();
}

// ========== ADMIN FUNCTION TO VIEW ALL USERS ==========
function showAllUsers() {
    let userList = '👥 PERMANENT USERS (Saved in browser):\n\n';
    users.forEach((u, i) => {
        userList += `${i+1}. ${u.username} / ${u.password} - ${u.fullName} (${u.accountType})\n`;
    });
    alert(userList);
}

// ========== ADMIN FUNCTION TO CLEAR ALL USERS (Use with caution) ==========
function resetToDefaultUsers() {
    if (confirm('⚠️ Warning: This will delete all created accounts and restore default users only. Continue?')) {
        const defaultUsers = [
            { username: 'john', password: 'demo123', fullName: 'John', email: 'john@example.com', accountType: 'Chase Total Checking®' },
            { username: 'james', password: 'demo123', fullName: 'James', email: 'james@example.com', accountType: 'Chase Savings℠' },
            { username: 'marymarquez88', password: 'Juniper.7783', fullName: 'Mary Marquez', email: 'mary@example.com', accountType: 'Chase Freedom Unlimited®' },
            { username: 'marymarquez', password: '7783', fullName: 'Mary', email: 'mary@example.com', accountType: 'Chase Total Checking®' }
        ];
        localStorage.setItem('bankUsers', JSON.stringify(defaultUsers));
        users = loadUsers();
        alert('Users reset to default. Page will reload.');
        location.reload();
    }
}

// ========== DEMO LOGIN ==========
function demoLogin() {
    const user = users.find(u => u.username === 'marymarquez88' && u.password === 'Juniper.7783');
    
    if (user) {
        currentUser = user;
        showLoading('Logging in as Mary Marquez...');
        
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            fullName: user.fullName,
            email: user.email || '',
            accountType: user.accountType || 'Chase Freedom Unlimited®'
        }));
        
        setTimeout(() => {
            hideLoading();
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        alert('Demo login failed. Please try again.');
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Always reload users to ensure Mary's credentials are there
    users = loadUsers();
    
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardUser();
    }
    
    if (document.querySelector('.slider-container')) {
        startSlider();
    }
    
    // Attach feature functions to dashboard elements
    document.querySelectorAll('.quick-action-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            handleQuickAction(action);
        });
    });
    
    document.querySelectorAll('.pay-btn, .quick-pay').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showPayBills();
        });
    });
    
    document.querySelectorAll('.schedule-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showPayBills();
        });
    });
    
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterTransactions();
        });
    });
    
    document.querySelectorAll('.card-footer a').forEach(link => {
        if (link.textContent.includes('Download')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                downloadStatement();
            });
        }
    });
    
    document.querySelectorAll('.tool-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const toolName = this.querySelector('h4')?.textContent || '';
            if (toolName.includes('calculator')) {
                showMortgageCalculator();
            } else if (toolName.includes('Budget')) {
                showBudgetPlanner();
            } else if (toolName.includes('Credit')) {
                showCreditScore();
            } else if (toolName.includes('branch')) {
                showBranchLocator();
            }
        });
    });
    
    document.querySelectorAll('.view-all').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showFeatureModal(
                '<i class="fas fa-list"></i> All Items',
                `<p style="margin: 20px 0; text-align: center;">This would show a complete list of all your accounts, transactions, and statements in a real bank.</p>`
            );
        });
    });
    
    document.querySelectorAll('.biometric-login').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLoading('Scanning fingerprint...');
            setTimeout(() => {
                hideLoading();
                showFeatureModal(
                    '<i class="fas fa-fingerprint"></i> Biometric Login',
                    `<div style="text-align: center; padding: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: #2C9A4C; margin-bottom: 15px;"></i>
                        <h4 style="margin-bottom: 10px;">Fingerprint Verified</h4>
                        <p style="color: #6B7A8D;">Your identity has been confirmed. You can now access your account.</p>
                    </div>`
                );
            }, 1500);
        });
    });
    
    document.querySelectorAll('.location-icon, .find-branch').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            showBranchLocator();
        });
    });
    
    document.querySelectorAll('.rewards-value, .rewards-card, .rewards-earned').forEach(el => {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            showRewards();
        });
    });
    
    document.querySelectorAll('.goal-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showFinancialGoals();
        });
    });
    
    document.querySelectorAll('.open-account-small').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showOpenAccount();
        });
    });
    
    document.querySelectorAll('.account-action:not(.pay-now)').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.trim();
            if (action.includes('Transfer')) {
                showTransfer();
            } else if (action.includes('Deposit')) {
                showDepositCheck();
            } else if (action.includes('View')) {
                showFeatureModal(
                    '<i class="fas fa-info-circle"></i> Account Details',
                    `<div style="margin-bottom: 20px;">
                        <div style="background: #F0F5FE; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                            <h4 style="margin-bottom: 10px;">Account Information</h4>
                            <p><strong>Account Number:</strong> ····4321</p>
                            <p><strong>Routing Number:</strong> 021000021</p>
                            <p><strong>Account Type:</strong> Everyday Checking</p>
                            <p><strong>Opened:</strong> January 15, 2023</p>
                        </div>
                        <div style="background: #F0F5FE; padding: 20px; border-radius: 12px;">
                            <h4 style="margin-bottom: 10px;">Recent Activity</h4>
                            <p><i class="fas fa-circle" style="font-size: 0.5rem; color: #0B5394;"></i> 5 transactions this month</p>
                            <p><i class="fas fa-circle" style="font-size: 0.5rem; color: #0B5394;"></i> No overdraft fees</p>
                            <p><i class="fas fa-circle" style="font-size: 0.5rem; color: #0B5394;"></i> Interest earned: $0.28</p>
                        </div>
                    </div>`
                );
            }
        });
    });
});

window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const accountModal = document.getElementById('openAccountModal');
    
    if (event.target === loginModal) {
        hideLoginModal();
    }
    if (event.target === accountModal) {
        hideOpenAccount();
    }
}