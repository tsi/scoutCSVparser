(function($) {

  var options = {
    "separator" : ";"
  };

  var hideCSVpopup = function(argument) {
    $('.csv-popup').fadeOut(250, function() {
      $(this).remove();
    })
  }

  var populateTable = function(data) {
    var errors = '',
        table = $('table[border="1"][cellpadding="2"][cellspacing="2"]'), // Assume border as table selector
        theadName = data[0][0], // Assume first line holds titles
        theadVal = data[0][1], // Assume first line holds values
        nameCol = $('tr:first td', table).filter(function() { // Assumes first tr holds headers
      return $(this).text().toLowerCase() === theadName; }
    ).index() + 1; // nth-child is "1-indexed"

    // Remove the headers row.
    data.shift();

    // Go over the list
    for(var row in data) {
      var tr = $('td:nth-child(' + nameCol +')', table).filter(function() { // Assumes first tr holds headers
        return $(this).text().toLowerCase() === data[row][0]; }
      ).closest('tr').index();
      if (tr > -1) {
        // Found the row, insert value.
        $('tr', table).eq(tr).find('input[type="text"]').val(data[row][1])
      }
      else {
        errors = errors + 'Could not find a row for ' + data[row][0] + '</br>';
      }
    }
    if (errors !== '') {
      $('.csv-popup-inner').html(errors);
    }
    else {
      hideCSVpopup();
    }
  }

  var handleCSVfile = function(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    var ext = file.name.split(".").pop().toLowerCase();
    if($.inArray(ext, ["csv"]) == -1) {
      alert('Upload CSV');
      return false;
    }
    var reader = new FileReader();
    var encoding = $('input#csv-popup-enc').is(':checked') ? "ISO-8859-8" : "UTF-8";
    reader.readAsText(file, encoding);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv, options);
      populateTable(data);
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }

  // Init
  $.fn.showCSVpopup = (function() {
    if (!$('.csv-popup').length) {
      var csvPopupWrp = $('<div />', {'class': 'csv-popup'})
        .append($('<span />', {'class': 'close'}).text('x').click(hideCSVpopup))
        .append($('<div />', {'class': 'csv-popup-inner'})
          .append($('<label />', {
            'for': 'csv-popup-file',
            'class': 'file-label'
          }).text('Select CSV file'))
          .append($('<input />', {
            'type': 'checkbox',
            'id': 'csv-popup-enc'
          }))
          .append($('<label />', {
            'for': 'csv-popup-enc'
          }).text('Windows Hebrew'))
          .append($('<input />', {
            'type': 'file',
            'id': 'csv-popup-file'
          }).change(handleCSVfile))
        );
      $('body').append(csvPopupWrp);
    }
  })();

})(jQuery);
