# FBQ - Teardown and Setup for FB pixel
The fbq method does not tear down or setup correctly. Small min file and functions to solve this.

# Example Usage
```javascript
FBQ_SETUP('FACEBOOK_PIXEL_ID', function() {
  fbq('track', 'PageView');
  fbq('trackCustom', 'My Custom Event');
  fbq('track', 'Purchase', {value: 70, currency: 'USD'});
});
```

*Multiple Pixels*
```javascript
FBQ_SETUP('FACEBOOK_PIXEL_ID', function() {
  fbq('addPixelId', 'SECOND_PIXEL_ID');
  fbq('addPixelId', 'THIRD_PIXEL_ID');

  fbq('track', 'PageView');
  fbq('trackCustom', 'My Custom Event');
  fbq('track', 'Purchase', {value: 70, currency: 'USD'});
});
```
