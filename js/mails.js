$(document).ready(function() {
	// Mails
	$("#cttemail").html('<a href="mailto:contact@mailcatch.com">contact@mailcatch.com</a>');
	$("#advemail").html('<a href="mailto:press@mailcatch.com">press@mailcatch.com</a>');

	// Menu
	$("#menu .item").mouseover(function(){ $(this).addClass("item_hover"); }).mouseout(function(){ $(this).removeClass("item_hover"); });
	$("#menu .item").not("a").click(function(){ document.location = $(this).find("a").attr("href"); });

	activateMailsList();
});

function activateMailsList()
{
	// Mails list
	$(".listmails .mail:even").addClass("mail_even").mouseover(function(){ $(this).addClass("mail_even_hover"); }).mouseout(function(){ $(this).removeClass("mail_even_hover"); });
	$(".listmails .mail:odd").addClass("mail_odd").mouseover(function(){ $(this).addClass("mail_odd_hover"); }).mouseout(function(){ $(this).removeClass("mail_odd_hover"); });
	$(".listmails .mail .from").not("a").click(function(){ window.open($(this).parent().find("a:first").attr("href"), "_top"); });
	$(".listmails .mail .subject").not("a").click(function(){ window.open($(this).find("a:first").attr("href"), "_top"); });
}

function iframeHeight(iframe)
{
	iframe.height = iframe.contentWindow.document.body.scrollHeight + 50;
}

var list_timeout = null;
var list_box = null;
function ListMailsRPC_List(box, anim)
{
	mcAjax("ListMailsRPC", "List", { box: box, anim: anim }, function(data){
		var first_id = $("#first_mail_id").val();
		if (data.first_id != first_id && mcAjaxHandle(data))
		{
		}
	});

	return false;
}
function ListMailsRPCGadget_List(del)
{
        var box = $("#box").val();
        mcAjax("ListMailsRPC", "List", { box: box, gadget: true, del: del }, function(data){
                var first_id = $("#first_mail_id").val();
                if (data.first_id != first_id && mcAjaxHandle(data))
                {
                        _IG_AdjustIFrameHeight();
                        var prefs = new _IG_Prefs();
                        prefs.set("box", box);
                        _IG_SetTitle("MailCatch Watcher: " + box);
                }
        });

        return true;
}

function activateListTimer(box, gadget)
{
	if (box == null) box = list_box;
	if (!gadget) ListMailsRPC_List(box, true);
	else ListMailsRPCGadget_List();
	list_box = box;
	if (!gadget) list_timeout = window.setTimeout("activateListTimer()", 60000)
	else list_timeout = window.setTimeout("activateListTimer(null, true)", 60000)
}

/****************************************************
 * Ajax helpers
 ****************************************************/
function mcAjax(mod, fct, data, callback)
{
	return jQuery.ajax({
		type: "POST",
		url: "/en/rpc.lua",
		data: "mod="+mod+"&fct="+fct+"&json="+encodeURIComponent(JSON.stringify(data)),
		success: callback,
		dataType: "json"
	});
}

function mcAjaxHandleDiv(id, data, append)
{
	if (!id) { id = data.div; }
	if (!$(id)[0]) return;

	if (data.anim)
	{
		$(id).hide();
	}
	if (data.html)
	{
		var html = "";
		for (var i = 0; i < data.html.length; i++) html += data.html[i];
		if (append)
		{
			$(id).attr("innerHTML", $(id).attr("innerHTML") + html);
		}
		else
		{
			$(id).attr("innerHTML", html);
		}
	}
	if (data.script) { eval(data.script); }
	if (data.anim)
	{
		$(id).show("fast");
	}

	/* Make sure lists are stripped */
	activateMailsList();
}

function mcAjaxHandle(data, id, append)
{
	if (data.success)
	{
		mcAjaxHandleDiv(id, data, append);
		if (data.others)
		{
			for (var i = 0; i < data.others.length; i++) mcAjaxHandleDiv(false, data.others[i], false);
		}
		return true;
	}
	return false;
}
