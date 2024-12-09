function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
      <div class="subbox1 subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
        <div class="subbox_11">
        <div id="dot">•</div>
        <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
        </div>
        <div class="subbox_22">
        <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
      </div>
    `;
}

function subtaskdesign(index) {
  return /*html*/ `
      <input id="inputsub${index}" class="editinput" type="text" placeholder="Edit subtask" />
      <div class="subbox_22">
        <button type="button" id="editsub${index}" class="buttondesign1 d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${index}" type="button" class="buttondesign"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${index}" type="button" class="buttondesign"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
    `;
}

function subtaskstemplAte(index, result) {
  return /*html*/ `
        <div class="subbox_11">
        <div id="dot">•</div>
        <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
        </div>
        <div class="subbox_22">
        <button type="button" id="editsub${index}" onclick="editsubtask(${index})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${index}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${index}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
    `;
}

function subtaskitemtemplateload(subtaskIndex, subtask) {
  return /*html*/ `
    <div class="subbox1 data subs1" id="subboxinput_${subtaskIndex}" data-index="${subtaskIndex}">
         <div class="subbox_11">
           <div id="dot">•</div>
           <div id="sub${subtaskIndex}" onclick="editsubtask(${subtaskIndex})">${subtask.subtask}</div>
         </div>
         <div class="subbox_22">
           <button type="button" id="editsub${subtaskIndex}" onclick="editsubtask(${subtaskIndex})" class="buttondesign d-none">
             <img src="/img/edit.png" alt="Edit">
           </button>
           <button id="deletesub${subtaskIndex}" type="button" class="buttondesign d-none">
             <img src="/img/delete1 (2).png" alt="Delete">
           </button>
           <button id="savesub${subtaskIndex}" type="button" class="buttondesign1 d-none">
             <img src="/img/check1 (1).png" alt="Check">
           </button>
         </div>
       </div>
  `;
}

function subtaskedittemplate(index, result) {
  return /*html*/ `
    <div class="subbox_11" >
      <div id="dot">•</div>
      <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0 d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
      </div>
  `;
}
