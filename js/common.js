/*
 * function to build profile
 */

var fieldIds = {};
function buildProfile( profileId, profileContainerId, contactId ) {
	//var params = {};
	var jsonProfile = {};

	if ( contactId ) {
    var dataUrl = '/civicrm/profile/edit?reset=1&json=1&gid=' + profileId +'&id=' + contactId;
	}
	else {
    var dataUrl = '/civicrm/profile/create?reset=1&json=1&gid=' + profileId;
	}
	$.getJSON( dataUrl,
		{
			format: "json"
		},
		function(data) {
			jsonProfile = data
			$().crmAPI ('UFField','get',{'version' :'3', 'uf_group_id' : profileId}
			,{ success:function (data){
				$.each(data.values, function(index, value) {
					var field;
					//Logic to handle the different field names generated by the API and JSON object, specifically with phone, email and address fields.
					if (value.location_type_id){
						if (value.field_name.indexOf("phone") != -1){
							var field = jsonProfile[value.field_name+"-"+value.location_type_id+"-"+value.phone_type_id];
						}
						else{
							var field = jsonProfile[value.field_name+"-"+value.location_type_id];
						}
					}
					else if (value.field_name.indexOf("email") != -1){
						var field = jsonProfile[value.field_name+"-Primary"];
					}
					else if (value.field_name.indexOf("phone") != -1){
						var field = jsonProfile[value.field_name+"-Primary-"+value.phone_type_id];
					}
					else{
						var field = jsonProfile[value.field_name];
					}

          //build fields
          field = field.html;

          $('#' + profileContainerId ).append('<div data-role="fieldcontain" class="ui-field-contain ui-body ui-br">'+field+'</div>');
          var id = $(field).attr('id');
          var tagName = $(field).get(0).tagName;
          //var tagName = tagName;
          if (tagName == 'INPUT'){
            $('#'+id).textinput();
            $('#'+id).attr( 'placeholder', value.label )
          }
          if (tagName == 'SELECT'){
            $('#'+id).selectmenu();
            $('#'+id).parent().parent().prepend('<label for="'+id+'">'+value.label+':</label>');
          }

          //gather all the processes field ids
          fieldIds[$(field).get(0).id] = "";
				});
			}
		});
	});
}

/**
 * Function to build profile view
 *
 * @param profileId
 * @param profileContainerId
 * @param contactId
 */
function buildProfileView( profileId, profileContainerId, contactId ) {
  $().crmAPI ('Contact','get',{'version' :'3', 'id' : contactId}
    ,{
      ajaxURL: crmajaxURL,
      success:function (data){
        var contactInfo = data.values[contactId];
        $().crmAPI ('UFField','get',{'version' :'3', 'uf_group_id' : profileId}
          ,{ success:function (data){
            $.each(data.values, function(index, value) {
              if ( contactInfo[value.field_name] ) {
                var content = '<li data-role="list-divider">'+value.label+'</li>' +
                  '<li role="option" tabindex="-1" data-theme="c" id="contact-'+value.field_name+'" >'+
                  contactInfo[value.field_name] +'</li>';
              }
              $('#' + profileContainerId).append(content);
            });
            $('#' + profileContainerId).listview('refresh');
          }
        });
      }
  });
}

/**
 * Save profile values
 */
function saveProfile( profileId, contactId ) {
  $.each(fieldIds, function(index, value) {
    fieldIds[index] = $('#'+index).val();
  });
  
  fieldIds.version = "3";
  fieldIds.contact_type = "Individual";
  if ( contactId ) {
    fieldIds.contact_id = contactId;
  }

  fieldIds.profile_id = profileId;
	$().crmAPI ('Profile','set', fieldIds
    ,{ success:function (data) {
			//$.mobile.changePage( "/civicrm/mobile/contact?action=view&cid="+data.id );
    }
  });
}
