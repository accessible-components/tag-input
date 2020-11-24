
/**
 * @accessible-components/tag-input - Simple and accessible component for creating tags.
 * @version v0.2.0
 * @link https://github.com/accessible-components/tag-input
 * @copyright 2020 Sergei Kriger, https://sergeikriger.com/
 * @license MIT
 */
// Simple
var simple = document.getElementById('simple');
var simpleCount = simple.parentNode.querySelector('.count');

var simpleTagInput = new TagInput(simple, {
  label: 'Colors',
  placeholder: 'Add tags',

  onInit: function onInit(tags) {
    simpleCount.textContent = tags.length;
  },

  onTagAdd: function onTagAdd(tag, tags) {
    simpleCount.textContent = tags.length;
  },
  onTagRemove: function onTagRemove(tag, tags) {
    simpleCount.textContent = tags.length;
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    simpleCount.textContent = tags.length;
  } });


// With tags
var tags = document.getElementById('tags');
var tagsCount = tags.parentNode.querySelector('.count');

var tagsTagInput = new TagInput(tags, {
  tags: ['jazz', 'blues', 'rock'],
  label: 'Genres',
  placeholder: 'Add genres',

  onInit: function onInit(tags) {
    tagsCount.textContent = tags.length;
  },

  onTagAdd: function onTagAdd(tag, tags) {
    tagsCount.textContent = tags.length;
  },
  onTagRemove: function onTagRemove(tag, tags) {
    tagsCount.textContent = tags.length;
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    tagsCount.textContent = tags.length;
  } });


// Disabled
var disabled = document.getElementById('disabled');
var disabledCount = disabled.parentNode.querySelector('.count');

var disabledTagInput = new TagInput(disabled, {
  tags: ['traveling', 'reading', 'cooking'],
  label: 'Interests',
  placeholder: 'Add interests',
  disabled: true,

  onInit: function onInit(tags) {
    disabledCount.textContent = tags.length;
  },

  onTagAdd: function onTagAdd(tag, tags) {
    disabledCount.textContent = tags.length;
  },
  onTagRemove: function onTagRemove(tag, tags) {
    disabledCount.textContent = tags.length;
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    disabledCount.textContent = tags.length;
  } });


// Control from outside
var control = document.getElementById('control');
var controlCount = control.parentNode.querySelector('.count');

var controlTagInput = new TagInput(control, {
  tags: ['public speaking', 'first impression'],
  label: 'Video tags',
  placeholder: 'Add interests',

  onInit: function onInit(tags) {
    controlCount.textContent = tags.length;
  },

  onTagAdd: function onTagAdd(tag, tags) {
    controlCount.textContent = tags.length;
  },
  onTagRemove: function onTagRemove(tag, tags) {
    controlCount.textContent = tags.length;
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    controlCount.textContent = tags.length;
  } });


control.parentNode.querySelectorAll('[data-tag]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    controlTagInput.addTag(e.target.dataset.tag);
  });
});

// Custom styles
var styles = document.getElementById('styles');
var stylesCount = styles.parentNode.querySelector('.count');

var stylesTagInput = new TagInput(styles, {
  tags: ['html', 'css', 'javascript'],
  label: 'Skills',
  hiddenLabel: true,
  placeholder: ' ',

  onInit: function onInit(tags) {
    stylesCount.textContent = tags.length;
  },

  onTagAdd: function onTagAdd(tag, tags) {
    stylesCount.textContent = tags.length;
  },
  onTagRemove: function onTagRemove(tag, tags) {
    stylesCount.textContent = tags.length;
  },
  onTagUpdate: function onTagUpdate(oldTag, newTag, tags) {
    stylesCount.textContent = tags.length;
  } });


// Form
var form = document.getElementById('form');
var formsTagInput = new TagInput(form, {
  tags: ['red', 'green', 'red', 'blue'],
  label: 'Colors',
  placeholder: 'Add colors' });


form.parentNode.addEventListener('submit', function (e) {
  e.preventDefault();
  alert("From submitted with tags ".concat(e.target['tag-input'].value));
});