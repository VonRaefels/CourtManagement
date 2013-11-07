$('#urbas').typeahead({
  name: 'urbas',
  local: urbas
});

$('.typeahead.input-sm').siblings('input.tt-hint').addClass('hint-small');
$('.typeahead.input-lg').siblings('input.tt-hint').addClass('hint-large');