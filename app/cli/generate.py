import click
import json
import debugpy

from pathlib import Path
from datetime import datetime
from ics import Calendar, Event
from ics.alarm import DisplayAlarm

def apply_options(event: dict, options: dict, alarms: list[dict]) -> dict:
    if "all_day" in options and options["all_day"]:
        event.make_all_day()
    if alarms:
        for a in alarms:
            if "trigger" in a:
                trigger = a.pop("trigger")
                if isinstance(trigger, str):
                    trigger = datetime.fromisoformat(trigger)
                a["trigger"] = trigger
            event.alarms.append(DisplayAlarm(**a))
    return event

def events_from_file(path: Path) -> list[Event]:
    """Read events ffrom a file."""
    with open(path, "r") as f:
        events_raw = json.load(f)
        
    events = []
    for e in events_raw:
        options = e.pop("options", {})
        alarms = e.pop("alarms", [])
        e = apply_options(Event(**e), options, alarms)        
        events.append(e)
        
    return set(events)

@click.command()
@click.option("--debug", is_flag=True, help="Enable debug mode.")
def generate(debug):
    """Generate something."""
    if debug:
        click.echo("Debug mode enabled.")
        debugpy.listen(5678)
        click.echo("Waiting for debugger attach...")
        debugpy.wait_for_client()
        
    c = Calendar()
    events = events_from_file(Path(__file__).parent.parent / "calendars" / "json" / "Rorbas_Abfallkalender_2026.json")
    c.events = events
    
    with open(Path(__file__).parent.parent / "calendars" / "ics" / "test.ics", "w") as f:
        f.writelines(c.serialize_iter())
        
    click.echo("Generating...")
    
if __name__ == "__main__":
    generate()