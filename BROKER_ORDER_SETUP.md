# Broker Display Order Setup

This setup allows you to control the exact order in which brokers appear on your `/brokers` page, matching the order from your daily forex site.

## Quick Setup Instructions

### Step 1: Run SQL in Supabase

Copy and paste this SQL into your Supabase SQL Editor:

```sql
-- Add display_order column to brokers table
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_brokers_display_order ON brokers(display_order);
```

### Step 2: Run the Setup Script

After running the SQL, execute:

```bash
node setup-broker-order-v2.js
```

### Step 3: Verify the Results

Visit your `/brokers` page to see the new order. The brokers should now appear in the preferred order instead of alphabetical.

## What This Does

### Database Changes
- Adds a `display_order` column to the `brokers` table
- Creates an index for better performance
- Sets display order values for all 117 brokers

### API Changes
- Updates `/api/brokers/route.ts` to sort by `display_order` by default
- Maintains backward compatibility with existing sort options

### Frontend Changes
- Updates `/brokers/page.tsx` to use "Featured Order" as default
- Adds "Featured Order" option to sort dropdown

## Preferred Broker Order

The script uses this order (based on industry standards and popularity):

1. **Top Tier Brokers**: XM, IC Markets, Pepperstone, FP Markets, Axi
2. **Major Established**: FXTM, Tickmill, Admirals, Eightcap, Forex.com
3. **US-Focused**: OANDA, IG Markets, CMC Markets, City Index, TD Ameritrade
4. **Popular Retail**: AvaTrade, Plus500, eToro, FBS, FXCM
5. **Others**: All remaining brokers in logical groupings

## Customizing the Order

To modify the broker order, edit the `PREFERRED_BROKER_ORDER` array in `setup-broker-order-v2.js` and re-run the script.

## Files Created/Modified

### New Files
- `setup-broker-order-v2.js` - Main setup script
- `add-display-order.sql` - SQL script for database changes
- `BROKER_ORDER_SETUP.md` - This documentation

### Modified Files
- `src/app/api/brokers/route.ts` - Added display_order sorting
- `src/app/brokers/page.tsx` - Updated default sort to display_order

## Troubleshooting

### If you get "column does not exist" error:
1. Make sure you ran the SQL in Supabase
2. Refresh your database connection
3. Run the setup script again

### If brokers still appear in alphabetical order:
1. Check that the SQL was executed successfully
2. Verify the setup script completed without errors
3. Clear your browser cache and reload the page

## Future Management

To update broker order in the future:
1. Modify the `PREFERRED_BROKER_ORDER` array in the setup script
2. Run `node setup-broker-order-v2.js`
3. The script will update all brokers with the new order

## Benefits

- **Custom Order**: Control exactly how brokers appear on your site
- **SEO Optimized**: Place high-value brokers first
- **User Experience**: Show most important brokers prominently
- **Easy Management**: Simple script to update order as needed
- **Performance**: Indexed database queries for fast loading

---

**Next Steps**: Run the SQL in Supabase, then execute the setup script to activate the new broker ordering system.