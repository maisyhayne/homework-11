var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
var activeNote = {};

// AJAX CALL GETS NOTES FROM DB
var getNotes = function() {
      return $.ajax({
            url: "/api/notes",
            method: "GET"
      });
};

// AJAX CALL POSTS NOTE TO DB
var saveNote = function(note) {
      return $.ajax({
            url: "/api/notes",
            data: note,
            method: "POST"
      });
};

// AJAX CALL DELETES NOTE FROM DB
var deleteNote = function(id) {
      return $.ajax({
            url: "api/notes/" + id,
            method: "DELETE"
      });
};

// DISPLAY SAVED NOTE
var renderActiveNote = function() {
      // HIDE THE SAVE BUTTON
      $saveNoteBtn.hide();

      // IF THERE IS AN ACTIVE NOTE DISPLAY IT
      if (activeNote.id) {
            $noteTitle.attr("readonly", true);
            $noteText.attr("readonly", true);
            $noteTitle.val(activeNote.title);
            $noteText.val(activeNote.text);
      } 
      //  ELSE RENDER EMPTY INPUTS
      else {
            $noteTitle.attr("readonly", false);
            $noteText.attr("readonly", false);
            $noteTitle.val("");
            $noteText.val("");
      }
};

// GET ENTERED NOTE TEXT AND SAVE
var handleNoteSave = function() {
      
      // GET THE NOTES TITLE AND TEXT FROM THE DOM ELEMENTS
      var newNote = {
            title: $noteTitle.val(),
            text: $noteText.val()
      };
      
      // PASS NOTE OBJECT INTO SAVENOTE
      saveNote(newNote).then(function(data) {
            // UPDATE NOTE LIST
            getAndRenderNotes();
            
            // DISPLAY SAVED NOTE
            renderActiveNote();
      });
};

// FUNCTION WHEN DELETE BUTTON IS CLICKED
var handleNoteDelete = function(event) {
      // prevents the click listener for the list from being called when the button inside of it is clicked
      event.stopPropagation();
      
      // ERASE NOTE BY DELETING ITS DATA
      var note = $(this).parent(".list-group-item").data();
      
      // IF THE DELETED NOTE IS THE ACTIVE NOTE DISPLAYED
      if (activeNote.id === note.id) {
            // MAKE ACTIVE NOTE EMPTY
            activeNote = {};
      }
      // PASS NOTE ID INTO FUNCTION
      deleteNote(note.id).then(function() {
            // UPDATE THE NEW LIST OF NOTES
            getAndRenderNotes();
            // DISPLAY ACTIVE NOTE
            renderActiveNote();
      });
};

// Sets the activeNote and displays it
var handleNoteView = function() {
      activeNote = $(this).data();
      renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
      activeNote = {};
      renderActiveNote();
};


// HIDE/SHOW SAVE BUTTON
var handleRenderSaveBtn = function() {
      // If a note's title or text are empty, hide the save button
      if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
            $saveNoteBtn.hide();
      }
      // Or else show it
      else {
            $saveNoteBtn.show();
      }
};

// RENDER LIST OF NOTES
var renderNoteList = function(notes) {
      
      // EMPTY THE LIST OF NOTES
      $noteList.empty();
      
      // CREATE ARRAY TO FILL WITH LIST ITEMS
      var noteListItems = [];
      
      // FOR EACH OF THE NOTES CREATE A TITLE SPAN AND DELETE BUTTON
      for (var i = 0; i < notes.length; i++) {
            
            // CURRENT NOTE
            var note = notes[i];
            
            //CREATE NEW LIST ITEM AND SET ITS DATA TO CURRENT NOTE
            var $li = $("<li class='list-group-item'>").data(note);
            
            // CREATE A NEW TITLE SPAN
            var $span = $("<span>").text(note.title);
            
            // CREATE NEW DELETE BUTTON 
            var $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");
            
            // TITLE SPAN AND DELETE BUTTON ARE A LIST ITEM
            $li.append($span, $delBtn);
            
            // ADD LIST ITEM TO ARRAY
            noteListItems.push($li);
      }
      // ADD THE LIST ITEMS TO THE NOTE LIST DOM ELEMENT
      $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
      
      return getNotes().then(function(data) {
            renderNoteList(data);
      });
};




// SAVE NOTE BUTTON
$saveNoteBtn.on("click", handleNoteSave);

// NOTE LIST
$noteList.on("click", ".list-group-item", handleNoteView);

// NEW NOTE BUTTON
$newNoteBtn.on("click", handleNewNoteView);

// DELETE NOTE BUTTON
$noteList.on("click", ".delete-note", handleNoteDelete);

// KEY RELEASED 
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();

