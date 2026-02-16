/**
 * PROJECT VECTOR — Clinician Portal Logic
 * 
 * Handles loading current phase criteria and recording new measurements.
 */

const API_BASE_URL = window.location.origin;

document.getElementById('loadCriteria').addEventListener('click', async () => {
    const clientId = document.getElementById('clientId').value;
    const status = document.getElementById('status');
    const form = document.getElementById('criteriaForm');
    const list = document.getElementById('criteriaList');

    status.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/client/${clientId}/journey`);
        if (!response.ok) throw new Error("Client not found or no active journey");

        const data = await response.json();
        const activePhase = data.phases.find(p => p.status === 'active');

        if (!activePhase) {
            throw new Error("No active phase found for this client");
        }

        list.innerHTML = `<h3>Phase: ${activePhase.name}</h3>`;
        const html = activePhase.criteria.map((c, i) => {
            // Label is "metric_name operator target unit"
            const parts = c.label.split(' ');
            const metricName = parts[0];
            const operator = parts[1] || '';
            const target = parts[2] || '';
            const unit = parts.slice(3).join(' ') || '';
            const inputId = `metric-${metricName}`;
            const helpId = `help-${metricName}`;

            return `
                <div class="criteria-group" style="margin-bottom: 1.5rem;">
                    <label for="${inputId}" style="display:block; margin-bottom:0.5rem; font-weight:bold;">
                        ${metricName.replace(/_/g, ' ')}
                    </label>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <input type="number" 
                               id="${inputId}" 
                               class="metric-input" 
                               data-metric="${metricName}" 
                               placeholder="e.g., ${target}"
                               aria-describedby="${helpId}"
                               step="0.1"
                               style="flex: 1; padding: 0.75rem;">
                        <span style="color: var(--text-muted); min-width: 60px;">${unit}</span>
                    </div>
                    <div id="${helpId}" class="help-text" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;">
                        Target: ${operator} ${target} ${unit}
                    </div>
                </div>
            `;
        }).join('');

        list.innerHTML = `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 4px; border-left: 3px solid var(--accent-primary);">
                <div style="font-size: 1.1em; font-weight: bold; color: var(--text-primary);">${data.client.name}</div>
                <div style="font-size: 0.9em; color: var(--text-muted);">${data.client.pathology} — ${activePhase.name}</div>
            </div>
            ${html}
        `;

        form.style.display = 'block';
    } catch (err) {
        status.textContent = err.message;
        status.className = 'status-msg error';
        status.style.display = 'block';
        form.style.display = 'none';
    }
});

document.getElementById('submitMetrics').addEventListener('click', async () => {
    const clientId = document.getElementById('clientId').value;
    const inputs = document.querySelectorAll('.metric-input');
    const status = document.getElementById('status');

    let successCount = 0;
    let failCount = 0;

    for (const input of inputs) {
        const val = input.value.trim();
        if (!val) continue;

        const metricName = input.dataset.metric;

        try {
            const response = await fetch(`${API_BASE_URL}/api/metric/record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: clientId,
                    metric_name: metricName,
                    value: val
                })
            });

            if (response.ok) successCount++;
            else failCount++;
        } catch (err) {
            failCount++;
        }
    }

    if (successCount > 0) {
        status.innerHTML = `Successfully recorded ${successCount} metrics. <a href="index.html" style="color: inherit; text-decoration: underline;">View Updated Dashboard &rarr;</a>`;
        status.className = 'status-msg success';
        status.style.display = 'block';
    } else if (failCount > 0) {
        status.textContent = `Failed to record metrics. Check console for details.`;
        status.className = 'status-msg error';
        status.style.display = 'block';
    }
});
