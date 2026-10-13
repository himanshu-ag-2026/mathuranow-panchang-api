<?php
// Data licence: CC BY-NC 4.0, credit required. Cache the result for a few minutes on your side.
function mathuranow_today(string $widget, string $lang): ?array
{
    $json = @file_get_contents('https://mathuranow.in/api/v1/' . $widget . '/today.' . $lang . '.json');
    if (false === $json) {
        return null;
    }
    $data = json_decode($json, true);
    return is_array($data) ? $data : null;
}

$d = mathuranow_today('rashifal', 'en');
if ($d && ($d['status'] ?? '') === 'published') {
    foreach ($d['data']['signs'] as $sign) {
        echo $sign['name'] . ': ' . $sign['text'] . "\n";
    }
    echo ($d['note'] ?? '') . "\n";
    echo $d['attribution_html'] . "\n";
} else {
    echo "Not published yet (pending), or the service is unreachable.\n";
}
