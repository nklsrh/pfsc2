// defining these up top so we can easily change these later if we need to.
var TICKET_CURRENCY = "TK";					  // currecny code for our Tickets VC

handlers.PlayMatchTickets = function(args) {
	// get the calling player's inventory and VC balances
	var GetUserInventoryRequest = {
        "PlayFabId": currentPlayerId
    };

     var GetUserInventoryResult = server.GetUserInventory(GetUserInventoryRequest);
	var userInventory = GetUserInventoryResult.Inventory;
	var userVcBalances = GetUserInventoryResult.VirtualCurrency;
	var userVcRecharge = GetUserInventoryResult.VirtualCurrencyRechargeTimes;

	// make sure the player has > 0 Tickets before proceeding. 
	try
	{
		if(!CheckTickets(userVcBalances))
		{
			throw "No Tickets remaining. Purchase additional Tickets or wait: " + userVcRecharge[TICKET_CURRENCY].SecondsToRecharge + " seconds.";
		}
	}
	catch(ex)
	{
		return JSON.stringify(ex);
	}
	
	
	var ticketsSpent = 1;
	if (args && args.hasOwnProperty("tp"))
	{
		if (args.tp > 1)
		{
			ticketsSpent = args.tp;
		}
	}
	
	
	SubtractVc(userVcBalances, TICKET_CURRENCY, ticketsSpent);
	
	var results = {};
		results.ticketsSpent = ticketsSpent;

	return JSON.stringify(results);
};


function CheckTickets(vcBalnces)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(TICKET_CURRENCY) && vcBalnces[TICKET_CURRENCY] > 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function AddVc(vcBalnces, code, qty)
{ 
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] += qty;
	}

	var AddUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": code,
	    "Amount": qty
    };
    var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
}

function SubtractVc(vcBalnces, code, qty)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] -= qty;
	}

	var SubtractUserVirtualCurrencyRequest = {
	    "PlayFabId" : currentPlayerId,
	    "VirtualCurrency": code,
	    "Amount": qty
    };

    var SubtractUserVirtualCurrencyResult = server.SubtractUserVirtualCurrency(SubtractUserVirtualCurrencyRequest);
}