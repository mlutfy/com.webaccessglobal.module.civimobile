<div id="jqm-contactsheader" data-role="header">
  <h3>Search Contacts</h3>
  <a href="#menu" data-ajax="true" id="home-main" data-transition="slideup" data-direction="reverse" data-role="button" data-icon="home" data-iconpos="notext" class="ui-btn-left jqm-home">Home</a>
  <a href="#add-contact-page"  style="text-decoration: none" id="add-contact-button" data-role="button" data-icon="plus" class="ui-btn-right jqm-home">Add</a>

</div> 

<div data-role="content" id="contact-content">
  <div class="ui-listview-filter ui-bar-c">
    <input type="search" name="sort_name" id="sort_name" value="" onkeyup="findContact()"/>
  </div>
  <ul id="contacts" data-role="listview" data-inset="false" data-filter="false"></ul>
</div>
  
</br>
    
<div>
  <a href="#contactslist" id="proximity-search-button"  data-role="button"  data-transition="slideup" >Proximity Search</a>
</div>



<script>


 
function findContact() {
  if ($("#sort_name").val()){
    contactSearch($("#sort_name").val());
  }
  else {
    $("#contacts").empty();
  } 
}

function contactSearch (q){
  $.mobile.showPageLoadingMsg( 'Searching' );
  $().crmAPI ('Contact','get',{'version' :'3', 'sort_name': q, 'return' : 'display_name,phone' }
  ,{ 
    ajaxURL: crmajaxURL,
      success:function (data){
        if (data.count == 0) {
          cmd = null;

        }
        else {
          cmd = "refresh";
          $('#contacts').show();
          /*$('#add_contact').hide();*/
          $('#contacts').empty();
        }
        $.each(data.values, function(key, value) {
          $('#contacts').append('<li role="option" tabindex="-1" data-ajax="false" data-theme="c" id="event-'+value.contact_id+'" ><a href="<?php print url('civicrm/mobile/contact/')?>'+value.contact_id+'" data-transition="slideup"  data-role="contact-'+value.contact_id+'">'+value.display_name+'</a></li>');
        });
        $.mobile.hidePageLoadingMsg( );
        $('#contacts').listview(cmd); 
      }
  });
}

</script>

<?php require_once 'civimobile.footer.php'; ?>
