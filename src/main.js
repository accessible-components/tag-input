// Simple
const simple = document.getElementById('simple');
const simpleCount = simple.parentNode.querySelector('.count');

const simpleTagInput = new TagInput(simple, {
  label: 'Colors',
  placeholder: 'Add tags',

  onInit: (tags) => {
    simpleCount.textContent = tags.length;
  },

  onTagAdd: (tag, tags) => {
    simpleCount.textContent = tags.length;
  },
  onTagRemove: (tag, tags) => {
    simpleCount.textContent = tags.length;
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    simpleCount.textContent = tags.length;
  },
});

// With tags
const tags = document.getElementById('tags');
const tagsCount = tags.parentNode.querySelector('.count');

const tagsTagInput = new TagInput(tags, {
  tags: ['jazz', 'blues', 'rock'],
  label: 'Genres',
  placeholder: 'Add genres',

  onInit: (tags) => {
    tagsCount.textContent = tags.length;
  },

  onTagAdd: (tag, tags) => {
    tagsCount.textContent = tags.length;
  },
  onTagRemove: (tag, tags) => {
    tagsCount.textContent = tags.length;
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    tagsCount.textContent = tags.length;
  },
});

// Disabled
const disabled = document.getElementById('disabled');
const disabledCount = disabled.parentNode.querySelector('.count');

const disabledTagInput = new TagInput(disabled, {
  tags: ['traveling', 'reading', 'cooking'],
  label: 'Interests',
  placeholder: 'Add interests',
  disabled: true,

  onInit: (tags) => {
    disabledCount.textContent = tags.length;
  },

  onTagAdd: (tag, tags) => {
    disabledCount.textContent = tags.length;
  },
  onTagRemove: (tag, tags) => {
    disabledCount.textContent = tags.length;
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    disabledCount.textContent = tags.length;
  },
});

// Control from outside
const control = document.getElementById('control');
const controlCount = control.parentNode.querySelector('.count');

const controlTagInput = new TagInput(control, {
  tags: ['public speaking', 'first impression'],
  label: 'Video tags',
  placeholder: 'Add interests',

  onInit: (tags) => {
    controlCount.textContent = tags.length;
  },

  onTagAdd: (tag, tags) => {
    controlCount.textContent = tags.length;
  },
  onTagRemove: (tag, tags) => {
    controlCount.textContent = tags.length;
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    controlCount.textContent = tags.length;
  },
});

control.parentNode.querySelectorAll('[data-tag]').forEach((el) => {
  el.addEventListener('click', (e) => {
    controlTagInput.addTag(e.target.dataset.tag);
  });
});

// Custom styles
const styles = document.getElementById('styles');
const stylesCount = styles.parentNode.querySelector('.count');

const stylesTagInput = new TagInput(styles, {
  tags: ['html', 'css', 'javascript'],
  label: 'Skills',
  hiddenLabel: true,
  placeholder: ' ',

  onInit: (tags) => {
    stylesCount.textContent = tags.length;
  },

  onTagAdd: (tag, tags) => {
    stylesCount.textContent = tags.length;
  },
  onTagRemove: (tag, tags) => {
    stylesCount.textContent = tags.length;
  },
  onTagUpdate: (oldTag, newTag, tags) => {
    stylesCount.textContent = tags.length;
  },
});

// Form
const form = document.getElementById('form');
const formsTagInput = new TagInput(form, {
  tags: ['red', 'green', 'red', 'blue'],
  label: 'Colors',
  placeholder: 'Add colors',
});

form.parentNode.addEventListener('submit', (e) => {
  e.preventDefault();
  alert(`From submitted with tags ${e.target['tag-input'].value}`);
});
