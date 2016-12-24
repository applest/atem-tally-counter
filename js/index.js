const ipcRenderer = require('electron').ipcRenderer;
const NUM_OF_CAMS = 8;

class TallyCounter {
  constructor() {
    this.initializeCounts();
    this.createElements();
    // this.changeTally(0);
    // this.addBalance(0, 1000);
    ipcRenderer.send('ping', null);
    ipcRenderer.on('change', (event, arg) => { this.onChange(arg); });
  }

  initializeCounts() {
    this.counts = [];
    for (var i = 0; i < NUM_OF_CAMS; i++) {
      this.counts.push(0);
    }
  }

  createElements() {
    this.elements = [];
    for (var i = 0; i < NUM_OF_CAMS; i++) {
      this.elements.push(this.createElement(i));
    }
  }

  createElement(num) {
    const item = document.createElement('div');
    item.className = 'flex-item';

    const name = document.createElement('span');
    name.className = 'cam-name';
    name.textContent = (num + 1) + 'CAM';
    item.appendChild(name);

    const balance = document.createElement('span');
    balance.className = 'cam-balance';
    item.appendChild(balance);

    const amount = document.createElement('span');
    amount.className = 'amount';
    amount.textContent = '0';
    balance.appendChild(amount);

    const suffix = document.createElement('span');
    suffix.className = 'suffix';
    suffix.textContent = '円';
    balance.appendChild(suffix);

    const box = document.getElementsByClassName('flex')[0];
    box.appendChild(item);

    return item;
  }

  addBalance(num, amount) {
    const element = this.elements[num];
    const count = this.counts[num] += amount;
    const amountElement = element.getElementsByClassName('amount')[0];
    amountElement.textContent = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  changeTally(num) {
    for (var i = 0; i < NUM_OF_CAMS; i++) {
      this.elements[i].getElementsByClassName('cam-name')[0].style.background = '';
    }

    const element = this.elements[num];
    const nameElement = element.getElementsByClassName('cam-name')[0];
    nameElement.style.background = 'red';
  }

  onChange(arg) {
    this.addBalance(arg, 10);
    this.changeTally(arg);
  }
}

window.addEventListener('load', () => {
  new TallyCounter();
});
