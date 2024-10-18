document.addEventListener('DOMContentLoaded', function() {

    const todoCount = localStorage.getItem('todoCount') || 0;
    const inprogressCount = localStorage.getItem('inprogressCount') || 0;
    const reviewCount = localStorage.getItem('reviewCount') || 0;
    const doneCount = localStorage.getItem('doneCount') || 0;
  
    document.getElementById('todo-task-count').textContent = todoCount;
    document.getElementById('inprogress-task-count').textContent = inprogressCount;
    document.getElementById('review-task-count').textContent = reviewCount;
    document.getElementById('done-task-count').textContent = doneCount;
  });
  
  document.addEventListener('DOMContentLoaded', function() {
 
    const todoCount = localStorage.getItem('todo-folderCount') || 0;
    const inprogressCount = localStorage.getItem('inprogress-folderCount') || 0;
    const reviewCount = localStorage.getItem('review-folderCount') || 0;
    const doneCount = localStorage.getItem('done-folderCount') || 0;
  
    document.getElementById('todo-task-count').textContent = todoCount;
    document.getElementById('inprogress-task-count').textContent = inprogressCount;
    document.getElementById('review-task-count').textContent = reviewCount;
    document.getElementById('done-task-count').textContent = doneCount;
  
    const totalTaskCount = parseInt(todoCount) + parseInt(inprogressCount) + parseInt(reviewCount) + parseInt(doneCount);
    document.getElementById('total-task-count').textContent = totalTaskCount; 
  });
  