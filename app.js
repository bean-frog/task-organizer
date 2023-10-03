// defs
const iconSel = document.getElementById('icon-sel');
const modal = document.getElementById('modal');
const icons = ['fa-flag', 'fa-circle-exclamation', 'fa-star', 'fa-face-smile', 'fa-face-meh', 'fa-face-frown', 'fa-bolt-lightning', 'fa-heart', 'fa-poo', 'fa-bookmark', 'fa-fire', 'fa-money-bill'];
const iconDisplay = document.getElementById('icon-display');
const closeModal = document.getElementById('close-modal');
const addTask = document.getElementById('add-task');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const colorPicker = document.getElementById('colorPicker');
const createTaskBtn = document.getElementById('createTaskBtn');
const cardArea = document.getElementById('card-area');
const totalTasks = document.getElementById('total-tasks');
const completedTasks = document.getElementById('completed-tasks');
const percentCompleted = document.getElementById('percent-completed');
const clearTasksButton = document.getElementById('clear-all');
let tasks = []
if (localStorage.getItem('tasks'))  {
tasks = JSON.parse(localStorage.getItem('tasks'))
}

// all onload functions 
document.addEventListener('DOMContentLoaded', function() {
    // icon sel init
      for (let i = 0; i < icons.length; i++) {
        let option = document.createElement('option');
        let iconName = icons[i].replace('fa-', '');
        option.value = icons[i];
        option.textContent = iconName;
        iconSel.appendChild(option);
      }
    iconDisplay.classList.add('fas', iconSel.value);
    if (cardArea.childNodes.length <= 0) {
        cardArea.innerHTML = `
        <div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">You don't have any tasks!</h1>
      <p class="py-6">Try adding some with the button below</p>
      <button onclick="modal.classList.remove('invisible')"class="btn btn-primary">Add Task</button>
    </div>
  </div>
</div>
        `
    } else {
        return;
    }
  });


// icon display
iconSel.addEventListener('change', function() {
    iconDisplay.setAttribute('class', '')
iconDisplay.classList.add('fas', iconSel.value)
});

// open/close modal
addTask.addEventListener('click', function() {
    modal.classList.remove('invisible');
})
closeModal.addEventListener('click', function() {
    modal.classList.add('invisible')
})

//task creation
createTaskBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!title || !desc) {
        alert('Please fill in all fields.');
        return; 
    }
    const newTask = {
        title: titleInput.value,
        desc: descInput.value,
        iconClass: iconSel.value,
        cardBorderColor: colorPicker.value,
        checked: false
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    modal.classList.add('invisible')
    renderCards();
    updateStats();
    titleInput.value = '';
    descInput.value = '';
});

function renderCards() {
    cardArea.innerHTML = '';
    tasks.forEach(task => {
        let cardTemplate = `
        <div class="absolute left-2 top-2"><i class="text-3xl fas ${task.iconClass}"></i></div>
                <div class="absolute right-2 top-2"><input type="checkbox" class="h-6 w-6 mr-4" id="checkbox"><button><i class="fas fa-trash-alt text-3xl text-red-600"></i></button></div>
                <div class="mt-8">
                     <h1 class="text-xl text-black">${task.title}</h1>
                    <h1 class="text-black text-l overflow-hidden max-w-[400px]">${task.desc}</h1>
                </div>
        `
      const cardDiv = document.createElement('div');
      cardDiv.setAttribute('class', 'relative p-6 m-2 shadow-lg h-fit');
      cardDiv.setAttribute('style', `width: 400px !important; border: 2px solid ${task.cardBorderColor}`)
      cardDiv.innerHTML = cardTemplate
    cardArea.appendChild(cardDiv);
    });
  }
    renderCards();
    window.addEventListener('storage', (event) => {
    if (event.key === 'tasks') {
      tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      renderCards();
    }
  });
  function updateStats() {
    amtTasks = tasks.length;
  totalTasks.textContent = " " + amtTasks;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkedCount = 0;
    
    function updateCompletedTasks() {
      checkedCount = 0;
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          checkedCount++;
        }
      });
      completedTasks.textContent = " " + checkedCount;
      
      const percentComplete = (checkedCount / amtTasks) * 100;
      percentCompleted.textContent = " " + Math.round(percentComplete) + '%';
    }
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateCompletedTasks);
    });
    
    updateCompletedTasks();
  }
  
  updateStats();
  function clearAllTasks() {
    if (window.confirm("This action is irreversible. Continue?")) {
        localStorage.clear('tasks');
       location.reload();
      } else {
        window.alert("Okay, canceling task deletion");
        return;
      }
  }
